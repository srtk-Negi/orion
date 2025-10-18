"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleCredentialsSignUp } from "@/server/actions/actions";
import { toast } from "sonner";

export default function SignUpPage() {
  const formAction = async (formData: FormData) => {
    try {
      await handleCredentialsSignUp(formData);
      toast.success("Account created successfully!");
    } catch (e: any) {
      toast.error("Something went wrong", { description: e });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="hover:text-primary underline underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
