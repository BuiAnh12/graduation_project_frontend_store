import React, { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "@/service/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
const ChangePasswordPopup = ({ onClose, employee }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (newPassword === "" || confirmPassword === "") {
      toast.error("Vui lòng nhập đủ thông tin");
      return;
    } else if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    } else if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không chính xác");
      return;
    }
    try {
      const res = await changePassword({ newPassword });
      toast.success("Đổi mật khẩu thành công!");
      onClose();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-[90%] max-w-md md:max-w-lg p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Cập nhật mật khẩu
        </h2>

        {/* New Password */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Mật khẩu mới:</label>
          <div className="relative flex items-center">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 text-lg"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Xác nhận mật khẩu:</label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 text-lg"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-around mt-6">
          <button
            onClick={onClose}
            className="w-32 py-2 bg-red-500 text-white font-semibold text-lg rounded-full hover:bg-red-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="w-32 py-2 bg-green-600 text-white font-semibold text-lg rounded-full hover:bg-green-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
