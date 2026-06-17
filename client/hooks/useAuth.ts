"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("probe_token");

    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);
}
