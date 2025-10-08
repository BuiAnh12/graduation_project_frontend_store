"use client";
import React, { useState } from "react";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";

const StoreTime = ({
  openHour,
  closeHour,
  openStatus,
  onUpdateTime,
  onToggle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempOpen, setTempOpen] = useState(openHour);
  const [tempClose, setTempClose] = useState(closeHour);

  const handleSave = () => {
    onUpdateTime({ openHour: tempOpen, closeHour: tempClose });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempOpen(openHour);
    setTempClose(closeHour);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-full space-y-6 rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Giờ hoạt động cửa hàng
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

      <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={openStatus === "opened"}
          onChange={onToggle}
        />
        <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        <span className="ms-3 text-sm font-medium text-gray-900">
          Hoạt động
        </span>
      </label>

      <div className="flex items-center justify-between">
        <label htmlFor="openHour" className="w-1/3 font-medium text-gray-700">
          Mở cửa:
        </label>
        {isEditing ? (
          <input
            type="time"
            id="openHour"
            className="w-2/3 rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={tempOpen}
            onChange={(e) => setTempOpen(e.target.value)}
          />
        ) : (
          <p className="w-2/3">{openHour}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="closeHour" className="w-1/3 font-medium text-gray-700">
          Đóng cửa:
        </label>
        {isEditing ? (
          <input
            type="time"
            id="closeHour"
            className="w-2/3 rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={tempClose}
            onChange={(e) => setTempClose(e.target.value)}
          />
        ) : (
          <p className="w-2/3">{closeHour}</p>
        )}
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

export default StoreTime;