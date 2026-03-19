"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!Cookies.get("dd_admin_token")) router.replace("/login");
  }, [router]);
  if (typeof window !== "undefined" && !Cookies.get("dd_admin_token")) return null;
  return <>{children}</>;
}
