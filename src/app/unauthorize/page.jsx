"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-[#f9f9f9] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/logo.png" // Replace with your illustration
            alt="Verification pending"
            width={150}
            height={150}
          />
        </div>
        <h1 className="text-2xl font-semibold text-red-500 mb-3">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-600 mb-6">
          Bạn không có quyền truy cập vào trang này.
          <br />
          Vui lòng đăng nhập lại hoặc quay về trang chủ.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/home")}
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
