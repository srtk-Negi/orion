import { db } from "@/server/db";
import { subscriptionsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getSubscriptionForTenant(tenantId: string) {
  const subscriptionData = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.tenantId, tenantId))
    .limit(1)
    .then((r) => r[0] ?? null);

  return subscriptionData;
}
