import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <div>Dashboard, hello {session.user.name}</div>;
};

export default Dashboard;
