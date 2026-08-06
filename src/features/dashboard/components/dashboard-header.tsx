"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/features/auth/store/user-store";

export const DashboardHeader = () => {
  const { name } = useUserStore();
  const [greeting, setGreeting] = useState("Welcome");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const currentHour = new Date().getHours();
    if (currentHour < 12) setGreeting("Good Morning");
    else if (currentHour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!isHydrated || !name) {
    return (
      <header className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </header>
    );
  }

  return (
    <header className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">
        {greeting}, {name}!
      </h1>
      <p className="text-sm text-gray-500 mt-1">Here is your system overview.</p>
    </header>
  );
};