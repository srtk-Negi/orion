import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/server/db";
import {
  type AppUserRoles,
  accountsTable,
  sessionsTable,
  usersTable,
  verificationTokensTable,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: AppUserRoles;
    } & DefaultSession["user"];
  }

  interface User {
    role?: AppUserRoles;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      credentials: {
        name: {
          type: "text",
          label: "Name",
          placeholder: "John Doe",
        },
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
      },
      authorize: async (credentials) => {
        let user = null;
        user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email as string));
        if (!user[0]) {
          return null;
        }
        console.log(user);
        return user[0];
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: usersTable,
    accountsTable: accountsTable,
    sessionsTable: sessionsTable,
    verificationTokensTable: verificationTokensTable,
  }),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      // Handle sign out - always redirect to home
      if (url.includes("/auth/signout") || url.includes("signout")) {
        return baseUrl + "/";
      }

      // Parse the URL to get search params
      const urlObj = new URL(url, baseUrl);
      const callbackUrl = urlObj.searchParams.get("callbackUrl");

      // If there's a callbackUrl in the query params, use it
      if (callbackUrl) {
        // Ensure it's a safe redirect (same origin)
        try {
          const callbackUrlObj = new URL(callbackUrl, baseUrl);
          if (callbackUrlObj.origin === new URL(baseUrl).origin) {
            return callbackUrl;
          }
        } catch (e) {
          // Invalid URL, fall back to default
        }
      }

      // Default sign-in redirect to tenants
      if (url.includes("/auth/signin") || url.includes("signin")) {
        return baseUrl + "/tenants";
      }

      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === new URL(baseUrl).origin) return url;

      // Default fallback
      return baseUrl + "/tenants";
    },
    jwt: async ({ user, token }) => {
      if (user) {
        ((token.id = user.id), (token.role = user.role));
      }
      return token;
    },
    session: async ({ session, user, token }) => {
      // Prioritize the user from the database on initial sign-in
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      // Fallback to the token for all subsequent requests
      else if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as AppUserRoles;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
