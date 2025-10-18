"use client";

import { signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => signOut({ redirectTo: "/" })}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
