import { z } from "zod";
import { TENANT_USER_ROLES } from "@/server/db/schema";

export const tenantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(255),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(255)
    .optional(),
  planId: z.string().uuid(),
});

export const planSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  rate: z.number(),
  period: z.string().nullable(),
  features: z.string().array(),
});

export const membershipSchema = z.object({
  userId: z.string().max(255),
  tenantId: z.string().uuid(),
  role: z.enum(TENANT_USER_ROLES).default("viewer"),
  invitedAt: z.date(),
  acceptedAt: z.date().nullable().optional(),
});

export type Tenant = z.infer<typeof tenantSchema>;
export type Plan = z.infer<typeof planSchema>;
export type Membership = z.infer<typeof membershipSchema>;
