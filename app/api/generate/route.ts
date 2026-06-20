import { NextResponse } from "next/server";
import type { StudyPlan, DayPlan } from "@/lib/types";

function buildPrompt(subject: string, topics: string, examDate: string, hoursPerDay: number, daysUntilExam: number): string {
  return `You are an expert study planner. Generate a detailed day-by-day study plan.

Subject: ${subject}
Topics to cover: ${topics}
Exam Date: ${examDate}
Days until exam: ${daysUntilExam}
Hours available per day: ${hoursPerDay}

Create a realistic, structured plan that covers all topics by the exam date. Return ONLY a raw JSON array (no markdown, no code fences) of day objects:

[
  {
    "day": 1,
    "date": "YYYY-MM-DD",
    "focus_area": "Main topic for the day",
    "topics_to_cover": ["specific subtopic 1", "specific subtopic 2"],
    "activities": ["Review concept X for 1 hour", "Practice problems on Y for 1.5 hours", "Take a quiz on Z for 30 minutes"],
    "estimated_hours": 4
  }
]

Each day should have 2-5 specific topics and 2-4 concrete activities. The plan must span from today to the day before the exam.`;
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
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4096,
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

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
