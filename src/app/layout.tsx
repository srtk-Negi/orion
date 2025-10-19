import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Orion - Financial Dashboard",
  description: "Navigate your financial universe with precision",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`dark font-sans antialiased`}>
        <SessionProvider>
          <Navbar />
          <main>
            {children}
            <Analytics />
          </main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
