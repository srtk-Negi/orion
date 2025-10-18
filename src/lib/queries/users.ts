import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function findUserByEmail(email: string) {
  const userData = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1)
    .then((r) => r[0] ?? null);
  return userData;
}
