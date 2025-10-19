import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/env";

async function answerUserQuery(question: string) {
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });

  return response.text;
}

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const userQuery = reqBody.question;
  const transactions = reqBody.transactions;

  const prompt = `The user is a social media creator earning money from different sources. Given are some recent transactions. Taking that into context, answer the users question. Transactions - ${transactions}
  User Query - ${userQuery}`;

  const response = await answerUserQuery(prompt);

  return NextResponse.json({ answer: response });
}
