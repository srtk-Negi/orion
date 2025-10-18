import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { env } from "@/env";
import { pgEnum } from "drizzle-orm/pg-core";

export const createTableFunction = pgTableCreator(
  (name) => `${env.APP_NAME}_${name}`,
);

// ------------------ CONSTS ------------------
export const APP_USER_ROLES = ["super_admin", "admin", "basic"] as const;

// ------------------ TYPES ------------------
export type AppUserRoles = (typeof APP_USER_ROLES)[number];

// ------------------ POSTGRES ENUMS ------------------
/**
 * user's role on the application level. For the SaaS dev team.
 */
export const appUserRoles = pgEnum("app_user_roles", APP_USER_ROLES);


// ------------------ USERS ------------------
export const usersTable = createTableFunction("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  role: appUserRoles().notNull().default("basic"),
}));

// ------------------ AUTH ------------------
export const accountsTable = createTableFunction(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => usersTable.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
    index("account_user_id_idx").on(table.userId),
  ],
);

export const sessionsTable = createTableFunction(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => usersTable.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (table) => [index("t_user_id_idx").on(table.userId)],
);

export const verificationTokensTable = createTableFunction(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);


// ------------------ RELATIONS ------------------
export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

