"use client";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPasswordWithEmail } from "@/service/auth";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const Page = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      router.push("/auth/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (password === "" || confirmedPassword === "") {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    } else if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    } else if (password !== confirmedPassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    try {
      await resetPasswordWithEmail({ email, newPassword: password });
      toast.success("Đổi mật khẩu mới thành công!");
      router.push("/auth/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-yellow-100 to-yellow-500 ">
      <ToastContainer />
      <div className="bg-white/90 p-8 rounded-xl shadow-lg w-[450px] text-center">
        <h2 className="text-xl font-bold mb-8">Tạo mật khẩu mới</h2>

        <div className="text-left mb-4">
          <label className="block font-bold mb-1">Mật khẩu mới</label>
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu mới phải có ít nhất 6 ký tự..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 text-gray-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <div className="text-left mb-4">
          <label className="block font-bold mb-1">
            Nhập lại mật khẩu vừa tạo của bạn
          </label>
          <div className="flex items-center relative">
            <input
              type={showConfirmedPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
              className="absolute right-2 text-gray-600"
            >
              <FontAwesomeIcon
                icon={showConfirmedPassword ? faEyeSlash : faEye}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-around mt-5 gap-4">
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-xl w-[150px]"
          >
            Quay lại
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-xl w-[150px]"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
