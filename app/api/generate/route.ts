import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import type { StudyPlan, DayPlan } from "@/lib/types";

function buildPrompt(subject: string, topics: string, examDate: string, hoursPerDay: number, daysUntilExam: number): string {
  const today = new Date();
  const startDateStr = today.toISOString().split("T")[0];

  return `You are an expert study planner. Generate a day-by-day study roadmap as a raw JSON array (no markdown, no code fences).

Subject: ${subject}
Topics to cover: ${topics}
Exam Date: ${examDate}
Days until exam: ${daysUntilExam}
Hours per day: ${hoursPerDay}
Start date: ${startDateStr}

Format:
[
  {
    "day": 1,
    "date": "YYYY-MM-DD",
    "focus_area": "Main topic",
    "topics_to_cover": ["subtopic 1", "subtopic 2"],
    "activities": ["Action 1 with duration", "Action 2 with duration"],
    "estimated_hours": 4,
    "week": 1
  }
]

Rules:
- day starts at 1, increments by 1 each consecutive day
- date starts at ${startDateStr}, must be real calendar dates
- estimated_hours ≤ ${hoursPerDay}
- week = week number (1, 2, 3...), ~7 days per week
- each day: 2-5 topics, 2-4 concrete activities
- cover all topics by the day before the exam`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, topics, examDate, hoursPerDay } = body;

    if (!subject || !topics || !examDate || !hoursPerDay) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    if (exam <= today) {
      return NextResponse.json({ error: "Exam date must be in the future" }, { status: 400 });
    }

    const daysUntilExam = Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const prompt = buildPrompt(subject, topics, examDate, hoursPerDay, daysUntilExam);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      let detail = `HTTP ${response.status}`;
      try {
        const parsed = JSON.parse(errBody);
        detail = parsed.error?.message || detail;
      } catch {}
      console.error("Groq API error:", response.status, errBody);
      return NextResponse.json({ error: `LLM API error: ${detail}` }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty response from LLM" }, { status: 502 });
    }

    let schedule: DayPlan[];
    try {
      const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      schedule = JSON.parse(cleaned);
      if (!Array.isArray(schedule)) throw new Error("Not an array");
    } catch {
      return NextResponse.json({ error: "Failed to parse LLM response as JSON" }, { status: 502 });
    }

    const plan: StudyPlan = {
      subject,
      topics,
      exam_date: examDate,
      hours_per_day: hoursPerDay,
      days_until_exam: daysUntilExam,
      schedule,
    };

    const { error: dbError } = await getSupabaseClient()
      .from("plans")
      .insert(plan as any);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
