"use client";
import React, { useRef, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkOTP, forgotPassword } from "@/service/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [expired, setExpired] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      router.push("/auth/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !e.target.value &&
      inputsRef.current[index - 1]
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (expired) {
      toast.error("OTP hết hạn, hãy click gửi lại OTP.");
      return;
    }

    const enteredOTP = otp.join("");
    if (enteredOTP.length !== 6) {
      toast.error("Vui lòng điền đầy đủ mã OTP.");
      return;
    }

    try {
      setLoading(true);
      await checkOTP({ email, otp: enteredOTP });
      toast.success("Xác thực thành công, đang chuyển sang trang tiếp");
      setTimeout(() => {
        router.push("/auth/reset-password");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "The OTP hết hạn hoặc không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      await forgotPassword({ email });
      toast.success("Gửi lại OTP thành công!");
      setTimeLeft(120);
      setExpired(false);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Gửi lại OTP thất bại!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-yellow-100 to-yellow-500">
      <ToastContainer />
      <div className="bg-white bg-opacity-95 p-8 rounded-xl shadow-lg w-96 text-center">
        <h3 className="text-2xl font-bold mb-2">Xác thực OTP</h3>
        <p className="text-sm text-gray-600 mb-5">(Kiểm tra email của bạn)</p>

        <div className="flex justify-center gap-2.5 mb-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              className="border-solid w-11 h-12 text-center text-xl border-2 border-gray-300 rounded-lg outline-none focus:border-black focus:shadow-[0_0_8px_rgba(125,60,255,0.5)] disabled:bg-gray-200"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={expired}
            />
          ))}
        </div>

        <p className="mb-4 text-gray-700">
          OTP hết hạn trong:
          <span className="font-bold">{formatTime(timeLeft)}</span>
        </p>

        <button
          onClick={handleVerifyOTP}
          disabled={expired || loading}
          className={`w-full py-3 text-white font-bold uppercase rounded-lg transition-colors ${
            loading ? "bg-gray-600" : "bg-black hover:bg-gray-900"
          }`}
        >
          {loading ? "Xác thực..." : expired ? "OTP hết hạn" : "Xác thực"}
        </button>

        <div className="my-4 text-sm text-gray-700">
          <p>Không thấy mã OTP?</p>
          <div className="flex justify-center gap-2 mt-1">
            <button
              onClick={handleSendOTP}
              className="text-blue-700 font-bold hover:underline"
            >
              Gửi lại
            </button>
            <span>|</span>
            <a
              href="/auth/forgot-password"
              className="text-blue-700 font-bold hover:underline"
            >
              Đổi lại email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
