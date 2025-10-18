import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignOutPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link href={"/"}>
            <Button variant={"destructive"} className="w-full">
              Take me home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
