import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { env } from "@/env";
import { pgEnum } from "drizzle-orm/pg-core";

export const createTableFunction = pgTableCreator(
  (name) => `${env.APP_NAME}_${name}`,
);

export const sourceEnum = pgEnum("source", [
  "YouTube",
  "Twitch",
  "Tiktok",
  "Amazon",
  "Shopify",
]);
export const statusEnum = pgEnum("status", ["pending", "cleared", "failed"]);

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

// ------------------ APPLICATION ------------------

export const transactionsTable = createTableFunction("transaction", (d) => ({
  id: d.serial().primaryKey(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  socialAccountId: d.serial().references(() => socialAccountsTable.id),
  source: sourceEnum().notNull(),
  name: d.text().notNull(), // e.g. "Twitch Subscriptions Oct 2025"
  amount: d.numeric({ precision: 12, scale: 2 }).notNull(),
  currency: d.text().default("USD").notNull(),
  date: d.timestamp().defaultNow().notNull(),
  status: statusEnum().default("cleared").notNull(),
  autoTag: d.varchar({ length: 255 }).notNull(),
  paymentMethod: d.text().notNull(), // PayPal, ACH etc.
  isRecurring: d.boolean().notNull().default(false),
}));

export const socialAccountsTable = createTableFunction(
  "social_account",
  (d) => ({
    id: d.serial().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => usersTable.id),
    provider: d.text().notNull(), // e.g. "youtube", "twitch", "shopify"
    providerAccountId: d
      .varchar({ length: 255 })
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    metadata: d.jsonb(), // optional details like channel name, subscriber count, etc
    connectedAt: d.timestamp().notNull().defaultNow(),
  }),
);

// ------------------ RELATIONS ------------------
export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  transactions: many(transactionsTable),
  socialAccounts: many(socialAccountsTable),
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

export const transactionsRelations = relations(
  transactionsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [transactionsTable.userId],
      references: [usersTable.id],
    }),
    socialAccount: one(socialAccountsTable, {
      fields: [transactionsTable.socialAccountId],
      references: [socialAccountsTable.id],
    }),
  }),
);

export const socialAccountsRelations = relations(
  socialAccountsTable,
  ({ many, one }) => ({
    transactions: many(transactionsTable),
    user: one(usersTable, {
      fields: [socialAccountsTable.userId],
      references: [usersTable.id],
    }),
  }),
);
