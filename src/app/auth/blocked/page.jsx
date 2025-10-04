"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BlockedPage = () => {
  const router = useRouter();

  const handleResetStore = () => {
    // Clear all relevant data from localStorage
    localStorage.clear();

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#f9f9f9] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/logo.jpg" // Optional: your blocked illustration
            alt="Access Blocked"
            width={150}
            height={150}
          />
        </div>
        <h1 className="text-2xl font-semibold text-red-500 mb-3">
          Tài khoản của bạn đã bị khóa
        </h1>
        <p className="text-gray-600 mb-6">
          Tài khoản hoặc cửa hàng của bạn đã bị khóa.
          <br />
          Vui lòng liên hệ bộ phận hỗ trợ để biết thêm chi tiết.
        </p>
        <button
          onClick={() => router.push("/support")}
          className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
        >
          Liên hệ hỗ trợ
        </button>
        <div className="mt-4">
          <button
            onClick={handleResetStore}
            className="text-blue-500 px-6 py-3 rounded-full font-medium hover:text-blue-700 transition"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;
