import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { logoutUser } from "@/service/auth";

const useLogout = () => {
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser(); // optional: you can also ignore response
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      router.push("/login"); // redirect to login page
    }
  }, [router]);

  return handleLogout;
};

export default useLogout;
