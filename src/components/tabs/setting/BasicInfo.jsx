"use client";
import React, { useState } from "react";
import { useUpdateStoreInformationMutation } from "../../../redux/features/store/storeApi";
import { FaEdit, FaSave } from "react-icons/fa";

const BasicInfo = ({ store }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: store?.name || "",
    description: store?.description || "",
    full_address: store?.address?.full_address || "",
  });

  const [updateStoreInformation] = useUpdateStoreInformationMutation();

  const handleEdit = (field) => {
    setIsEditing(true);
  };

  const handleChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateStoreInformation({
        storeId: store._id,
        updates: {
          name: editedData.name,
          description: editedData.description,
          address: { full_address: editedData.full_address },
        },
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
      
      {/* Store Name */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">Tên cửa hàng:</span>
        <div className="flex items-center">
          {isEditing ? (
            <input 
              type="text" 
              value={editedData.name} 
              onChange={(e) => handleChange(e, "name")}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span className="text-gray-800">{editedData.name}</span>
          )}
          <FaEdit className="ml-2 text-gray-500 cursor-pointer" onClick={() => handleEdit("name")} />
        </div>
      </div>

      {/* Description */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">Mô tả:</span>
        <div className="flex items-center">
          {isEditing ? (
            <input 
              type="text" 
              value={editedData.description} 
              onChange={(e) => handleChange(e, "description")}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span className="text-gray-800">{editedData.description}</span>
          )}
          <FaEdit className="ml-2 text-gray-500 cursor-pointer" onClick={() => handleEdit("description")} />
        </div>
      </div>

      {/* Address */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">Địa chỉ:</span>
        <div className="flex items-center">
          {isEditing ? (
            <input 
              type="text" 
              value={editedData.full_address} 
              onChange={(e) => handleChange(e, "full_address")}
              className="border rounded px-2 py-1"
            />
          ) : (
            <span className="text-gray-800">{editedData.full_address}</span>
          )}
          <FaEdit className="ml-2 text-gray-500 cursor-pointer" onClick={() => handleEdit("full_address")} />
        </div>
      </div>

      {/* Ratings (Static) */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Đánh giá trung bình:</span>
        <span className="text-yellow-500 font-semibold">{(store?.avgRating ?? 0).toFixed(1)} ⭐</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-gray-600">Lượt đánh giá:</span>
        <span className="text-gray-800">{store?.amountRating || 0}</span>
      </div>

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <FaSave className="mr-2" />
          Cập nhật
        </button>
      )}
    </div>
  );
};

export default BasicInfo;
