import "server-only";

import { db } from "@/server/db";
import { tenantsTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const generateUniqueSlug = async (name: string): Promise<string> => {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingTenant = await db.query.tenantsTable.findFirst({
      where: eq(tenantsTable.slug, slug),
    });

    if (!existingTenant) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

/**
 * Returns the current user in server components, raises an error if not authenticated.
 * This is a strict server only function and should not be called from client.
 *
 * @returns current user object
 */
export const getCurrentUser = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not Authenticated");
  }
  return session.user;
};
