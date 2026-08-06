import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function LandingPage() {

  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg max-w-2xl w-full border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome to the Salary Slip Management System
        </h1>
        <p className="text-lg text-gray-600">
          Manage your salary slips and requests efficiently. Secure access for admins and employees.
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Link 
            href="/sign-in" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up" 
            className="px-6 py-3 bg-white text-blue-600 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}