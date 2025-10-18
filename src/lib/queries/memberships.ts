import "server-only";

import { db } from "@/server/db";
import { membershipsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import type { Membership } from "@/lib/validators/validationSchemas";

export async function getMembershipsByUserId(userId: string) {
  const membershipData = await db
    .select()
    .from(membershipsTable)
    .where(eq(membershipsTable.userId, userId));
  return membershipData;
}

export async function insertMembership(membership: Membership) {
  await db.insert(membershipsTable).values(membership);
}
