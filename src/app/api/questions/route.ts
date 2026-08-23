import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.question.findMany();
  const questions = rows.map((q) => ({
    id: q.id,
    topic: q.topic,
    questionText: q.questionText,
    choices: JSON.parse(q.choices) as string[],
    answerIndex: q.answerIndex,
    explanation: q.explanation,
    difficulty: q.difficulty,
  }));
  return NextResponse.json({ questions });
}
