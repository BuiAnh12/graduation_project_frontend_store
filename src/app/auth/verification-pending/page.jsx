"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const StoreVerificationPending = () => {
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
        <h2 className="text-2xl font-semibold text-[#333] mb-3">
          Cửa hàng của bạn đang chờ xác minh
        </h2>
        <p className="text-gray-600 mb-6">
          Hệ thống đang kiểm tra và xác minh thông tin cửa hàng của bạn.
          <br />
          Quá trình này có thể kéo dài từ vài phút đến vài giờ tùy thuộc vào số
          lượng yêu cầu hiện tại.
          <br />
          Chúng tôi sẽ thông báo cho bạn ngay khi quá trình hoàn tất.
        </p>
        <button
          disabled
          className="bg-gray-300 text-gray-600 px-6 py-3 rounded-full font-medium cursor-not-allowed"
        >
          Đang chờ xác minh...
        </button>
      </div>
    </div>
  );
};

export default StoreVerificationPending;
