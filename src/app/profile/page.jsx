"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROLE_LABELS } from "@/data/roleLabel";
import ChangePasswordPopup from "@/components/popups/Account/ChangePasswordPopup";
import UpdateAccountInfoPopup from "@/components/popups/Account/UpdateAccountInfoPopup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { getProfile, checkCurrentPassword } from "@/service/profile";

const Page = () => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const clearOldPassword = () => setOldPassword("");

  const [showChangeInfoPopup, setShowChangeInfoPopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const response = await getProfile();
      setAccount(response.data);
    } catch (error) {
      console.error("Error get info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openUpdatePopup = () => setShowChangeInfoPopup(true);
  const handleChangeInfoClose = () => {
    setShowChangeInfoPopup(false);
    clearOldPassword();
  };
  const handleChangePasswordClose = () => setShowChangePasswordPopup(false);

  const handleVerifiedOldPassword = async () => {
    if (!oldPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại!");
    }
    try {
      const res = await checkCurrentPassword({ currentPassword: oldPassword });
      if (res.data) {
        toast.success("Sẵn sàng để đổi mật khẩu!");
        setIsVerified(true);
        setShowChangePasswordPopup(true);
        clearOldPassword();
      } else {
        toast.error("Mật khẩu nhập lại không đúng!");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  // Chuyển role array thành chuỗi dễ đọc
  const getRoleLabels = (roles = []) =>
    roles.map((r) => ROLE_LABELS[r] || r).join(", ");

  if (isLoading)
    return <p className="text-center text-lg font-medium">Loading...</p>;

  return (
    <div className="m-5">
      <Header title="Thông tin cá nhân" goBack={true} />
      <h1 className="text-xl md:text-2xl font-semibold text-center md:text-left">
        Tài khoản của bạn
      </h1>

      {/* Personal info */}
      <div className="mt-4 flex flex-col md:flex-row justify-between gap-5">
        {/* LEFT: Avatar */}
        <div className="flex flex-col items-center border border-solid border-gray-300 rounded-xl p-6 w-full md:w-1/3">
          <h2 className="text-lg font-semibold mb-5">Ảnh đại diện</h2>

          {account?.avatarImage?.url ? (
            <img
              src={account.avatarImage.url}
              alt="Avatar"
              className="w-20 h-20 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              Không có ảnh
            </div>
          )}

          <button
            onClick={openUpdatePopup}
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg w-full sm:w-auto"
          >
            Cập nhật thông tin
          </button>
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col items-center border border-solid border-gray-300 md:flex-[2] rounded-xl py-4 px-4">
          <div className="text-lg font-bold mb-5 mt-1">Thông tin cá nhân</div>
          <div className="mt-3 mb-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 m-2">
              <span className="text-md font-bold w-36 sm:w-40">Họ tên:</span>
              <span className="text-md break-words">{account.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 m-2">
              <span className="text-md font-bold w-36 sm:w-40">Email:</span>
              <span className="text-md break-all">{account.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 m-2">
              <span className="text-md font-bold w-36 sm:w-40">Giới tính:</span>
              <span className="text-md">{getGenderLabel(account.gender)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 m-2">
              <span className="text-md font-bold w-36 sm:w-40">
                Số điện thoại:
              </span>
              <span className="text-md break-all">{account.phonenumber}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 m-2">
              <span className="text-md font-bold w-36 sm:w-40">Vai trò:</span>
              <span className="text-md">{getRoleLabels(account.role)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="border-solid border border-gray-300 mt-4 flex flex-col p-4 sm:p-6 rounded-xl">
        <div className="text-lg font-bold mb-5 text-center sm:text-left">
          Đổi mật khẩu
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
            <span className="text-md font-bold min-w-[130px]">
              Mật khẩu hiện tại:
            </span>
            <div className="relative flex-1 max-w-sm">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full border border-solid border-gray-400 rounded-lg p-2 pr-9 text-base focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {passwordVisible ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </span>
            </div>
          </div>

          <button
            onClick={handleVerifiedOldPassword}
            className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Tiếp tục
          </button>
        </div>
      </div>

      {/* Popups */}
      {showChangePasswordPopup && (
        <ChangePasswordPopup
          onClose={handleChangePasswordClose}
          employee={account}
        />
      )}

      {showChangeInfoPopup && (
        <UpdateAccountInfoPopup
          onClose={handleChangeInfoClose}
          account={account}
          setShowUpdatePopup={setShowChangeInfoPopup}
          onAccountUpdate={fetchInfo}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Page;
