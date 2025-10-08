"use client";
import React, { useState } from "react";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";

const StoreImages = ({ avatarUrl, coverUrl, onUpdateImages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(avatarUrl);
  const [previewCover, setPreviewCover] = useState(coverUrl);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleSelectAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSelectCover = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    onUpdateImages({
      avatar: avatarFile,
      cover: coverFile,
      originalAvatarUrl: previewAvatar,
      originalCoverUrl: previewCover,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPreviewAvatar(avatarUrl);
    setPreviewCover(coverUrl);
    setAvatarFile(null);
    setCoverFile(null);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-full space-y-6 rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Ảnh cửa hàng</h2>
        {!isEditing && (
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setIsEditing(true)}
            title="Chỉnh sửa"
          >
            <FaPen />
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="w-full md:w-1/5">
          <label className="block font-bold text-gray-700 mb-2">
            Ảnh đại diện
          </label>
          {previewAvatar && (
            <img
              src={previewAvatar}
              alt="Avatar Preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
          )}
          {isEditing && (
            <div className="mt-2">
              <label className="cursor-pointer inline-block rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectAvatar}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Cover */}
        <div className="w-full md:w-4/5">
          <label className="block font-bold text-gray-700 mb-2">Ảnh bìa</label>
          {previewCover && (
            <img
              src={previewCover}
              alt="Cover Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
          )}
          {isEditing && (
            <div className="mt-2">
              <label className="cursor-pointer inline-block rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelectCover}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-4 mt-2">
          <button
            className="text-green-600 hover:text-green-800"
            onClick={handleSave}
            title="Lưu"
          >
            <FaCheck />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={handleCancel}
            title="Hủy"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreImages;