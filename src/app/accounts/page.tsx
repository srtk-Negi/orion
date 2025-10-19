import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import PlatformsPage from "./platforms";
import { db } from "@/server/db";
import { socialAccountsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface SocialAccount {
  id: number;
  userId: string;
  provider: string;
  providerAccountId: string;
  metadata: any;
  connectedAt: Date;
}

const ConnectedAccounts = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const connectedAccounts: SocialAccount[] = await db
    .select()
    .from(socialAccountsTable)
    .where(eq(socialAccountsTable.userId, session.user.id));

  return (
    <div className="dark radial-bg mt-10">
      <PlatformsPage
        connectedAccounts={connectedAccounts}
        onConnect={async (provider, metadata) => {
          "use server";
          await db.insert(socialAccountsTable).values({
            userId: session.user.id,
            provider: provider,
            metadata: metadata,
          });
          revalidatePath("/accounts");
        }}
        onDisconnect={async (accountId) => {
          "use server";
          await db
            .delete(socialAccountsTable)
            .where(eq(socialAccountsTable.id, accountId));
          revalidatePath("/accounts");
        }}
      />
    </div>
  );
};

export default ConnectedAccounts;
