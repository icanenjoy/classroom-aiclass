import { NextResponse } from "next/server";
import { questions } from "@/data/questions";

export async function GET() {
  return NextResponse.json({ questions });
}
