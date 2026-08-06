import { NextResponse } from "next/server";
import { getEmployeeSalarySlips } from "@/features/employees/services/admin-employee.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const slips = await getEmployeeSalarySlips(id);

    return NextResponse.json({ success: true, data: slips }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch salary history" }, { status: 500 });
  }
}