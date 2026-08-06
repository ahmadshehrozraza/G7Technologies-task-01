import { NextResponse } from "next/server";
import { getEmployeeProfile, updateEmployeeProfile } from "@/features/employees/services/admin-employee.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const employee = await getEmployeeProfile(id);
    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: employee }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedProfile = await updateEmployeeProfile(id, body);
    return NextResponse.json({ success: true, data: updatedProfile }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}