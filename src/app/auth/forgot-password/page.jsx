"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "@/service/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSendOTP = async () => {
    try {
      const response = await forgotPassword({ email });
      toast.success("Mã OTP đã được gửi tới email!");
      sessionStorage.setItem("email", email);
      router.push("/auth/verify-otp");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Gửi OTP thất bại");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-500">
      <ToastContainer />

      <div className="bg-white/90 rounded-xl shadow-lg p-6 sm:p-8 w-11/12 sm:w-[400px] md:w-[480px] text-center">
        <h2 className="text-lg font-bold mb-6 text-gray-800">
          Hãy nhập email tài khoản của bạn
        </h2>

        <div className="text-left mb-4">
          <label className="block font-semibold mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="example@gmail.com..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 rounded-lg transition-all w-full sm:w-36"
          >
            Quay lại
          </button>
          <button
            onClick={handleSendOTP}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-all w-full sm:w-36"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
