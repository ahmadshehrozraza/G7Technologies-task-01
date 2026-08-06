import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner"; // FIXED: Using the new Sonner Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Salary Portal",
  description: "Internship Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" /> 
        </Providers>
      </body>
    </html>
  );
}