import { prisma } from "@/lib/prisma";

export async function getPendingEmployees() {
  const employees = await prisma.user.findMany({
    where: { 
      role: "EMPLOYEE",
      status: "PENDING" 
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" }
  });
  
  return {
    count: employees.length,
    data: employees
  };
}

export async function updateEmployeeStatus(id: string, status: "VERIFIED" | "REJECTED") {
  return prisma.user.update({
    where: { id },
    data: { status }
  });
}

export async function getAllEmployees() {
  const employees = await prisma.user.findMany({
    where: { 
      role: "EMPLOYEE",
      status: "VERIFIED" 
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" }
  });
  
  return { 
    count: employees.length, 
    data: employees 
  };
}

export async function getRejectedEmployees() {
  const employees = await prisma.user.findMany({
    where: { 
      role: "EMPLOYEE",
      status: "REJECTED" 
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" }
  });
  
  return { count: employees.length, data: employees };
}

export async function deleteEmployee(id: string) {
  return prisma.$transaction([
    prisma.employeeProfile.deleteMany({
      where: { userId: id },
    }),
    prisma.user.delete({
      where: { id },
    }),
  ]);
}

export async function getEmployeeProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      profile: true,
    },
  });
}

export async function updateEmployeeProfile(userId: string, data: { department?: string; designation?: string; phone?: string; address?: string }) {
  return prisma.employeeProfile.update({
    where: { userId },
    data,
  });
}

export async function generateSalarySlip(
  userId: string,
  data: {
    month: string;
    year: number;
    basicSalary: number;
    bonus: number;
    deduction: number;
  }
) {
  const netAmount = data.basicSalary + data.bonus - data.deduction;

  return prisma.salarySlip.upsert({
    where: {
      userId_month_year: {
        userId,
        month: data.month,
        year: data.year,
      },
    },
    update: {
      basicSalary: data.basicSalary,
      bonus: data.bonus,
      deduction: data.deduction,
      netAmount,
      status: "GENERATED",
    },
    create: {
      userId,
      month: data.month,
      year: data.year,
      basicSalary: data.basicSalary,
      bonus: data.bonus,
      deduction: data.deduction,
      netAmount,
      status: "GENERATED",
    },
  });
}

export async function getEmployeeSalarySlips(userId: string) {
  return prisma.salarySlip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}