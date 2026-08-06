import { NextResponse } from "next/server";
import { generateSalarySlip } from "@/features/employees/services/admin-employee.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  // Security Guard: Only ADMIN can generate salary slips
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { month, year, basicSalary, bonus, deduction } = body;

    if (!month || !year || basicSalary === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: month, year, or basicSalary" },
        { status: 400 }
      );
    }

    const slip = await generateSalarySlip(resolvedParams.id, {
      month,
      year: Number(year),
      basicSalary: Number(basicSalary),
      bonus: Number(bonus || 0),
      deduction: Number(deduction || 0),
    });

    return NextResponse.json(
      { success: true, message: "Salary slip generated successfully", data: slip },
      { status: 200 }
    );
  } catch (error) {
    console.error("Salary Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate salary slip" },
      { status: 500 }
    );
  }
}