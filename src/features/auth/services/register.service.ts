import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function registerNewUser(data: RegisterPayload) {
  if (!data.name || !data.email || !data.password) {
    throw new Error("All fields are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "EMPLOYEE",
      status: "PENDING", 
      profile: {
        create: {
          department: "TBD",
          designation: "TBD",
          cnic: `TBD-${Date.now()}`, 
          phone: "TBD",
          address: "TBD",
          dob: new Date(),
          joiningDate: new Date(),
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    } 
  });

  return newUser;
}