"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { updateProfileInfo } from "@/service/profile";
import { uploadImage } from "@/service/upload";

const UpdateAccountInfoPopup = ({
  account,
  setShowUpdatePopup,
  onAccountUpdate,
}) => {
  const [accountInfo, setAccountInfo] = useState({
    name: account.name || "",
    email: account.email || "",
    phonenumber: account.phonenumber || "",
    gender: account.gender || "",
    avatarImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(
    account.avatarImage?.url ||
      "https://res.cloudinary.com/datnguyen240/image/upload/v1722168751/avatars/avatar_pnncdk.png"
  );

  // handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAccountInfo((prev) => ({ ...prev, avatarImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!accountInfo.name.trim()) return toast.error("Vui lòng nhập họ tên");
    if (!accountInfo.email.trim())
      return toast.error("Vui lòng không để trống email");
    if (!accountInfo.phonenumber.trim())
      return toast.error("Vui lòng không để trống số điện thoại");
    if (!accountInfo.gender.trim())
      return toast.error("VUi lòng chọn giới tính");

    setLoading(true);
    try {
      let avatarId = account.avatarImage?._id;

      if (accountInfo.avatarImage) {
        let image = await uploadImage(accountInfo.avatarImage);
        avatarId = image.id;
      }

      const res = await updateProfileInfo({
        name: accountInfo.name,
        email: accountInfo.email,
        phonenumber: accountInfo.phonenumber,
        avatarImage: avatarId,
      });
      if (res.success) {
        Swal.fire("Thành công!", "Tài khoản đã được cập nhật!", "success");
        setShowUpdatePopup(false);
        if (onAccountUpdate) onAccountUpdate();
      }
    } catch (error) {
      console.error("❌ Error updating account:", error);
      toast.error(error.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg animate-scaleIn p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Cập nhật thông tin tài khoản
        </h3>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* LEFT - Avatar */}
          <div className="flex-1 flex flex-col items-center">
            <img
              src={previewAvatar}
              alt="Avatar Preview"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border border-solid border-gray-300 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              id="avatarInput"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById("avatarInput").click()}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Chọn ảnh
            </button>
          </div>

          {/* RIGHT - Form */}
          <div className="flex-1 md:flex-[2] flex flex-col gap-4">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="font-semibold mb-1 text-sm sm:text-base">
                  Họ và tên:
                </label>
                <input
                  type="text"
                  value={accountInfo.name}
                  onChange={(e) =>
                    setAccountInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Nhập họ tên..."
                  className="w-full border border-solid border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="font-semibold mb-1 text-sm sm:text-base">
                  Email:
                </label>
                <input
                  type="text"
                  value={accountInfo.email}
                  onChange={(e) =>
                    setAccountInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Nhập email..."
                  className="w-full border border-solid border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="font-semibold mb-1 text-sm sm:text-base">
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  value={accountInfo.phonenumber}
                  onChange={(e) =>
                    setAccountInfo((prev) => ({
                      ...prev,
                      phonenumber: e.target.value,
                    }))
                  }
                  placeholder="Nhập số điện thoại..."
                  className="w-full border border-solid border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="font-semibold mb-1 text-sm sm:text-base">
                  Giới tính:
                </label>
                <select
                  value={accountInfo.gender}
                  onChange={(e) =>
                    setAccountInfo((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="w-full border border-solid border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none text-sm sm:text-base"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
          <button
            onClick={() => setShowUpdatePopup(false)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-8 rounded-lg transition duration-200 text-sm sm:text-base"
          >
            Hủy
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold py-2 px-8 rounded-lg transition duration-200 text-sm sm:text-base`}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAccountInfoPopup;
