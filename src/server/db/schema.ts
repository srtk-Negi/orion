import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { env } from "@/env";
import { pgEnum } from "drizzle-orm/pg-core";

export const createTableFunction = pgTableCreator(
  (name) => `${env.APP_NAME}_${name}`,
);

export const sourceEnum = pgEnum("source", [
  "youtube",
  "twitch",
  "tiktok",
  "amazon",
  "shopify",
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
  financialAccountId: d.serial().references(() => financialAccountsTable.id),
  source: sourceEnum().notNull(),
  name: d.text().notNull(), // e.g. "Twitch Subscriptions Oct 2025"
  amount: d.numeric({ precision: 12, scale: 2 }).notNull(),
  currency: d.text().default("USD"),
  date: d.timestamp().defaultNow(),
  status: statusEnum().default("cleared"),
  paymentMethod: d.text(), // PayPal, ACH, etc.
  isRecurring: d.boolean().default(false),
  createdAt: d.timestamp().defaultNow(),
}));

export const financialAccountsTable = createTableFunction(
  "financial_account",
  (d) => ({
    id: d.serial().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => usersTable.id),
    provider: d.text().notNull(), // e.g. "youtube", "twitch", "shopify"
    providerAccountId: d.text().notNull(), // external ID
    accessToken: d.text(),
    refreshToken: d.text(),
    metadata: d.jsonb(), // optional details like channel name
    connectedAt: d.timestamp().defaultNow(),
  }),
);

export const tagsTable = createTableFunction("tag", (d) => ({
  id: d.serial().primaryKey(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  name: d.text().notNull(), // e.g. "ad_revenue", "affiliate", "merch_sales"
  color: d.text().default("#4F46E5"),
  createdAt: d.timestamp().defaultNow(),
}));

export const transactionTagsTable = createTableFunction(
  "transaction_tag",
  (d) => ({
    id: d.serial().primaryKey(),
    transactionId: d
      .integer()
      .notNull()
      .references(() => transactionsTable.id),
    tagId: d
      .integer()
      .notNull()
      .references(() => tagsTable.id),
  }),
);

export const logsTable = createTableFunction("log", (d) => ({
  id: d.serial().primaryKey(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => usersTable.id),
  type: d.text().notNull(), // "ai_tagging", "api_sync", etc.
  message: d.text(),
  details: d.jsonb(), // e.g. { source: "YouTube", count: 12 }
  createdAt: d.timestamp().defaultNow(),
}));

// ------------------ RELATIONS ------------------
export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  transactions: many(transactionsTable),
  financialAccounts: many(financialAccountsTable),
  tags: many(tagsTable),
  logs: many(logsTable),
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
    financialAccount: one(financialAccountsTable, {
      fields: [transactionsTable.financialAccountId],
      references: [financialAccountsTable.id],
    }),
    transactionTags: many(transactionTagsTable),
  }),
);

export const financialAccountsRelations = relations(
  financialAccountsTable,
  ({ many, one }) => ({
    transactions: many(transactionsTable),
    user: one(usersTable, {
      fields: [financialAccountsTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const tagsRelations = relations(tagsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [tagsTable.userId],
    references: [usersTable.id],
  }),
  transactionTags: many(transactionTagsTable),
}));

export const transactionTagsRelations = relations(
  transactionTagsTable,
  ({ one }) => ({
    transaction: one(transactionsTable, {
      fields: [transactionTagsTable.transactionId],
      references: [transactionsTable.id],
    }),
    tag: one(tagsTable, {
      fields: [transactionTagsTable.tagId],
      references: [tagsTable.id],
    }),
  }),
);

export const logsRelations = relations(logsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [logsTable.userId],
    references: [usersTable.id],
  }),
}));
