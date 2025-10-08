"use client";
import React, { useState } from "react";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";

const StoreInfo = ({ storeInfo, categories, onUpdateInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(storeInfo.name);
  const [tempDesc, setTempDesc] = useState(storeInfo.description);
  const [tempCats, setTempCats] = useState(storeInfo.systemCategoryId || []);

  const toggleCategory = (categoryId) => {
    const isChecked = tempCats.some((c) => c._id === categoryId);
    const updated = isChecked
      ? tempCats.filter((c) => c._id !== categoryId)
      : [...tempCats, categories.find((c) => c._id === categoryId)];
    setTempCats(updated);
  };

  const handleSave = () => {
    const updatedData = {
      name: tempName,
      description: tempDesc,
      systemCategoryId: tempCats.map((c) => c._id),
    };
    onUpdateInfo(updatedData); // callback từ page.jsx
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(storeInfo.name);
    setTempDesc(storeInfo.description);
    setTempCats(storeInfo.storeCategory || []);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-full space-y-6 rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Thông tin cửa hàng
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Chỉnh sửa"
          >
            <FaPen />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="w-1/3 font-medium text-gray-700">
            Tên cửa hàng
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={tempName}
            readOnly={!isEditing}
            onChange={(e) => setTempName(e.target.value)}
          />
        </div>

        <div>
          <label className="w-1/3 font-medium text-gray-700">Mô tả</label>
          <textarea
            className="h-[100px] w-full resize-none rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={tempDesc}
            readOnly={!isEditing}
            onChange={(e) => setTempDesc(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="w-1/3 font-medium text-gray-700">
            Danh mục cửa hàng
          </label>
          <div className="flex flex-wrap gap-3 px-3 py-2">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={tempCats.some((c) => c._id === cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                  disabled={!isEditing}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
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

export default StoreInfo;