import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";
import { EmployeeDashboard } from "@/features/dashboard/components/employee-dashboard";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  const user = session!.user;

  return (
    <div className="space-y-6">
      
      <DashboardHeader />

      {user.role === "ADMIN" ? (
        <AdminDashboard user={user} />
      ) : (
        <EmployeeDashboard user={user} />
      )}
      
    </div>
  );
}