import { defineConfig } from "drizzle-kit";
import { env } from "@/env";

const config = defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  tablesFilter: [`${env.APP_NAME}_*`],
});

export default config;
