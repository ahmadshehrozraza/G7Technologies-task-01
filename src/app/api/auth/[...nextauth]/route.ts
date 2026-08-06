import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // FIXED: Using the shared global instance

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        // FIXED: Using the new 'status' Enum instead of 'isApproved'
        if (user.status === "PENDING") {
          throw new Error("Account pending admin approval");
        }
        
        if (user.status === "REJECTED") {
          throw new Error("Your account has been rejected by Admin");
        }

        // FIXED: Returning 'status' to satisfy next-auth.d.ts
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status, // Added this field
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status; // FIXED: Injecting status into JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "EMPLOYEE";
        session.user.status = token.status as "PENDING" | "VERIFIED" | "REJECTED"; // FIXED: Injecting status into Session
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in", // NOTE: Adjusted to match your directory name '/sign-in' instead of '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };