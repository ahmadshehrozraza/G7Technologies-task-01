import { prisma } from "@/lib/prisma";

export async function getEmployeeDashboardData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      profile: true,
      slips: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return user;
}

export async function updateEmployeePersonalDetails(userId: string, data: { name?: string; email?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}