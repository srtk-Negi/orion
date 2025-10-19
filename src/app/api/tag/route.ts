import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const transactionName = req.nextUrl.searchParams.get("transactionName");
  console.log(transactionName);

  return NextResponse.json({ transactionName });
}
