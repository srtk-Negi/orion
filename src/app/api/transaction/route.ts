import { db } from "@/server/db";
import { transactionsTable, socialAccountsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "./mockTransactions";
import { GoogleGenAI } from "@google/genai";
import { env } from "@/env";

async function generateAutoTag(transaction: string) {
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const prompt = `You are an agent working in a creator finance management app. Your job is to take a transaction and give it a tag. For example - the transaction is about youtube add sense revenue, then the tag givenn should be ad_sense. Or lat's say it's a brand sponsorship payment, the the tag should be sponsorship. Use the following pattern to intelligently tag the given transaction. VERY VERY IMPORTANT - ONLY RETURN THE PROPER TAG IN YOUR RESPONSE. NO QUOTES, NOT PERIODS, NOTHING. PURELY JUST THE TAG AND NO OTHER PIECE OF TEXT OR ANY CHARACTER. DO NOT RETURN MARKDOWN. Here is a transaction record - ${transaction}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

export async function POST(req: Request) {
  const youTubeAccountId = await db
    .select({ id: socialAccountsTable.id })
    .from(socialAccountsTable)
    .where(eq(socialAccountsTable.provider, "youtube"));

  if (!youTubeAccountId) return NextResponse.json({ message: "Failure" });

  const transaction = MOCK_TRANSACTIONS[randomInt(0, 49)];

  if (!transaction) return NextResponse.json({ message: "Failure" });

  const autoTag = await generateAutoTag(JSON.stringify(transaction));

  const payload = {
    ...transaction,
    socialAccountId: String(youTubeAccountId[0]?.id),
    autoTag: String(autoTag),
  };

  await db.insert(transactionsTable).values(payload);

  return NextResponse.json({ message: "Sucess" });
}
