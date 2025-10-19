import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { TransactionTable } from "@/components/transaction-table";
import { db } from "@/server/db";
import { transactionsTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { type Transaction } from "../dashboard/page";

const Insight = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const transactions: Transaction[] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, session.user.id))
    .orderBy(desc(transactionsTable.date));

  return (
    <div className="radial-bg mt-10 min-h-screen p-6">
      <div className="my-5 text-center">
        <h2 className="text-3xl font-bold">Insights</h2>
        <p className="text-muted-foreground mt-2">
          Get AI Insight Of Your Finances
        </p>
      </div>
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default Insight;
