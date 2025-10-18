// components/RouteGuard.tsx
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

interface RouteGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function RouteGuard({
  children,
  redirectTo = "/auth/signin",
}: RouteGuardProps) {
  const session = await auth();

  if (!session) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
