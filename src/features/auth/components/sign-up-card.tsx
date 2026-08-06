"use client";

import { useState } from "react";
import Link from "next/link";

export const SignUpCard = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Failed to register");
      } else if (result.success) {
        setSuccess(result.message); 
        e.currentTarget.reset();
      }
    } catch (err: any) {
      // setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-500 mt-2">Sign up as an Employee</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border">{error}</div>}
        {success && <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border">{success}</div>}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input name="name" type="text" required disabled={isLoading} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input name="email" type="email" required disabled={isLoading} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="john@example.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input name="password" type="password" required disabled={isLoading} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50">
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account? <Link href="/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
      </p>
    </div>
  );
};