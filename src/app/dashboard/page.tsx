import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { TransactionTable } from "@/components/transaction-table";
import { db } from "@/server/db";
import { transactionsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export interface Transaction {
  id: number;
  userId: string;
  socialAccountId: number;
  source: "youtube" | "twitch" | "tiktok" | "amazon" | "shopify";
  name: string;
  amount: string;
  currency: string;
  date: Date;
  status: "pending" | "cleared" | "failed";
  autoTag: string;
  paymentMethod: string;
  isRecurring: boolean;
}

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const transactions: Transaction[] = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, session.user.id));

  return (
    <div className="dark radial-bg mt-10">
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default Dashboard;
