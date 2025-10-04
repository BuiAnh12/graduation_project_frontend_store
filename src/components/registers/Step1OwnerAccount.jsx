import { checkEmail } from "@/service/staff";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Step1OwnerAccount = ({ data, setData, nextStep }) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleNext = async () => {
    if (
      !data.email ||
      !data.ownerName ||
      !data.password ||
      !data.phonenumber ||
      !data.gender ||
      !confirmPassword
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (!data.ownerName.trim()) {
      toast.error("Tên không được để trống");
      return;
    }

    if (!data.email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!/^\d{9,11}$/.test(data.phonenumber)) {
      return toast.error("Số điện thoại không hợp lệ");
    }
    if (data.password.length < 6) {
      toast.error("Mật khẩu có ít nhất 6 ký tự.");
      return;
    }
    if (data.password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp.");
      return;
    }
    try {
      const res = await checkEmail(data.email);
      if (res.success) {
        toast.success("Thành cônng");
        nextStep();
        return;
      }
    } catch (error) {
      if (error.data.errorCode && error.data.errorCode === "EMAIL_EXISTS") {
        toast.error("Email đã tồn tại");
      } else if (error.data.errorCode) {
        toast.error("Lỗi kiểm tra email: ", error.data.errorCode);
      } else {
        toast.error("Lỗi kiểm tra email: ", error);
      }
    }
  };

  return (
    <div className="w-full max-w-none rounded-2xl border m-2 border-gray-100 bg-white p-[50px] shadow-lg md:px-12 lg:px-24 xl:px-32">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Nhập thông tin tài khoản
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Họ tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ tên
          </label>
          <div className="relative flex items-center border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaUser className="text-gray-400" />
            <input
              type="text"
              name="name"
              value={data.ownerName}
              onChange={(e) => setData({ ...data, ownerName: e.target.value })}
              placeholder="Nhập họ tên"
              className="ml-2 w-full pr-8 outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative flex items-center border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="example@gmail.com"
              className="ml-2 w-full pr-8 outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative flex items-center border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaLock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="********"
              className="ml-2 w-full pr-8 outline-none text-gray-700 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Nhập lại mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhập lại mật khẩu
          </label>
          <div className="relative flex items-center border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaLock className="text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="ml-2 w-full pr-8 outline-none text-gray-700 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="relative flex items-center border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaPhone className="text-gray-400" />
            <input
              type="text"
              name="phonenumber"
              value={data.phonenumber}
              onChange={(e) =>
                setData({ ...data, phonenumber: e.target.value })
              }
              placeholder="Nhập số điện thoại"
              className="ml-2 w-full pr-8 outline-none text-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới tính
          </label>
          <div className="relative flex items-center border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
            <select
              name="gender"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
              className="w-full bg-transparent outline-none text-gray-700"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
      >
        Tiếp tục
      </button>
    </div>
  );
};

export default Step1OwnerAccount;
