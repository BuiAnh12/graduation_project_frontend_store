"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import localStorageService from "@/utils/localStorageService";
import jwtDecode from "jwt-decode";

export default function Protected({ role = [], children }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [canRender, setCanRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorageService.getToken();
        const store = localStorageService.getStore();

        console.log("TOKEN: ", token);

        // Nếu không có token => chưa đăng nhập
        if (!token) {
          router.replace("/unauthorize");
          return;
        }

        // Giải mã token
        let decoded;
        try {
          decoded = jwtDecode(token);
        } catch (err) {
          console.error("JWT decode error:", err);
          router.replace("/unauthorize");
          return;
        }

        const { role: tokenRoles, exp } = decoded;

        // Token hết hạn
        const now = Date.now() / 1000;
        if (exp && exp < now) {
          console.warn("Token expired");
          localStorageService.clearAll();
          router.replace("/unauthorize");
          return;
        }

        // Kiểm tra trạng thái cửa hàng
        const isBlocked = store?.status === "BLOCKED";
        if (isBlocked) {
          router.replace("/blocked");
          return;
        }

        // Xử lý role (tokenRoles có thể là string hoặc array)
        const userRoles = Array.isArray(tokenRoles) ? tokenRoles : [tokenRoles];
        const hasPermission = userRoles.some((r) => role.includes(r));

        if (!hasPermission) {
          router.replace("/unauthorize");
          return;
        }

        // Nếu qua được tất cả check
        setCanRender(true);
      } catch (err) {
        console.error("Error checking auth:", err);
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
