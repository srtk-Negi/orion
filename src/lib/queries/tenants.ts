import "server-only";

import { tenantsTable, membershipsTable, plansTable } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import type { Tenant } from "@/lib/validators/validationSchemas";
import { generateUniqueSlug } from "@/lib/serverUtils";

/**
 * Gets all the teams the user is a member of.
 */
export async function getTenants(userId: string) {
  const tenants = await db
    .select({
      id: tenantsTable.id,
      name: tenantsTable.name,
      slug: tenantsTable.slug,
      planId: tenantsTable.planId,
      createdAt: tenantsTable.createdAt,
      role: membershipsTable.role,
      plan: plansTable.name,
      members: sql<number>`(SELECT CAST(COUNT(*) AS INTEGER) FROM ${membershipsTable} WHERE ${membershipsTable.tenantId} = ${tenantsTable.id})`,
    })
    .from(tenantsTable)
    .innerJoin(membershipsTable, eq(membershipsTable.tenantId, tenantsTable.id))
    .innerJoin(plansTable, eq(tenantsTable.planId, plansTable.id))
    .where(eq(membershipsTable.userId, userId));

  return tenants;
}

export async function insertTenant(tenant: Tenant) {
  const slug = await generateUniqueSlug(tenant.name);
  try {
    const response = await db
      .insert(tenantsTable)
      .values({
        name: tenant.name,
        slug: slug,
        planId: tenant.planId,
      })
      .returning();

    if (!response[0]) {
      throw new Error();
    }
    return {
      success: true,
      data: response[0],
    };
  } catch {
    return {
      success: false,
      error: "Could not create tenant",
    };
  }
}
/**
 * Fetches a tenant by slug.
 * Returns null if not found, throws on DB errors.
 */
export async function getTenantBySlug(slug: string) {
  try {
    const tenant = await db
      .select()
      .from(tenantsTable)
      .where(eq(tenantsTable.slug, slug));

    if (!tenant[0]) {
      throw new Error("No tenant found!");
    }

    return tenant[0];
  } catch {
    throw new Error("Unable to fetch tenant at this time. Please try again.");
  }
}
