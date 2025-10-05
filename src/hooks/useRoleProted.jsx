"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Protected({ role, children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [canRender, setCanRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const roleStr = localStorage.getItem("role");
        const storeStr = localStorage.getItem("store");

        let roleArray = [];
        if (roleStr) {
          try {
            roleArray = JSON.parse(roleStr); // Try parsing roles as array
          } catch {
            roleArray = [roleStr]; // Fallback to single role
          }
        }

        let store = null;
        if (storeStr) {
          try {
            store = JSON.parse(storeStr);
          } catch (err) {
            console.error("Error parsing store:", err);
          }
        }

        const isBlocked = store?.status === "BLOCKED";
        const isAuthorized =
          userId &&
          token &&
          Array.isArray(roleArray) &&
          roleArray.some((r) => role.includes(r)); // ✅ allow if any role matches

        if (isBlocked) {
          router.replace("/blocked");
        } else if (!isAuthorized) {
          router.replace("/unauthorize");
        } else {
          setCanRender(true);
        }
      } catch (err) {
        console.error("Error in checkAuth:", err);
        router.replace("/unauthorize");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [role, router]);

  if (checkingAuth || !canRender) return null;

  return children;
}
