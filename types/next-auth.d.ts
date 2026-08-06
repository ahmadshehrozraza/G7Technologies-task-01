import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {

  interface User extends DefaultUser {
    id: string;
    role: "ADMIN" | "EMPLOYEE";
    status: "PENDING" | "VERIFIED" | "REJECTED";
  }


  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "EMPLOYEE";
      status: "PENDING" | "VERIFIED" | "REJECTED";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "EMPLOYEE";
    status: "PENDING" | "VERIFIED" | "REJECTED";
  }
}