"use client";
import Protected from "@/hooks/useRoleProtected";

export default function Layout({ children }) {
  return (
    <Protected role={["STORE_OWNER", "MANAGER"]}>{children}</Protected>
  );
}
F