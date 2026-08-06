"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "../store/user-store";

export function SessionSync() {
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {

    if (status === "authenticated" && session?.user) {
      setUser({

        id: (session.user as any).id, 
        name: session.user.name as string,
        email: session.user.email as string,
        role: (session.user as any).role,
      });
    } 

    else if (status === "unauthenticated") {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  return null; 
}