"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const UserButton = ({ name, role }: { name: string; role: string }) => {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs font-semibold text-blue-600">{role}</p>
      </div>
      <button
        onClick={async () => {
          await signOut({ redirect: false });
          router.replace("/sign-in");
        }}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
      >
        Logout
      </button>
    </div>
  );
};