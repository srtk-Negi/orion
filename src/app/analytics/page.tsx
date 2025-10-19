import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { DataAnalytics } from "@/components/data-analytics";

const Analytics = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="dark radial-bg mt-10 min-h-screen p-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Data Analytics (metrics not being used)
      </h2>
      <p className="text-muted-foreground mt-2">
        Comprehensive insights into your income streams
      </p>
      <DataAnalytics />
    </div>
  );
};

export default Analytics;
