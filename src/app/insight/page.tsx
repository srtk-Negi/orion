import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { transactionsTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { ChatWindow } from "@/components/ChatWindow";

export interface InsightTransaction {
  source: string;
  name: string;
  amount: string;
  isRecurring: boolean;
}

const Insight = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const transactions: InsightTransaction[] = await db
    .select({
      source: transactionsTable.source,
      name: transactionsTable.name,
      amount: transactionsTable.amount,
      isRecurring: transactionsTable.isRecurring,
    })
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, session.user.id))
    .orderBy(desc(transactionsTable.date))
    .limit(10);

  return (
    <div className="radial-bg mt-10 min-h-screen p-6">
      <div className="my-5 text-center">
        <h2 className="text-3xl font-bold">Insights</h2>
        <p className="text-muted-foreground mt-2">
          Get AI Insight Of Your Finances
        </p>
      </div>

      <div className="mt-8">
        <ChatWindow transactions={transactions} />
      </div>
    </div>
  );
};

export default Insight;
