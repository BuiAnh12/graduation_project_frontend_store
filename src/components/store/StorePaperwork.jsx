"use client";

import React, { useState } from "react";
import { FaPen, FaCheck, FaTimes } from "react-icons/fa";

const StorePaperwork = ({
  ICFrontUrl,
  ICBackUrl,
  BusinessLicenseUrl,
  onUpdatePaperwork,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewICFront, setPreviewICFront] = useState(ICFrontUrl);
  const [previewICBack, setPreviewICBack] = useState(ICBackUrl);
  const [previewBusinessLicense, setPreviewBusinessLicense] =
    useState(BusinessLicenseUrl);
  const [ICFrontFile, setFrontFile] = useState(null);
  const [ICBackFile, setBackFile] = useState(null);
  const [BusinessLicenseFile, setBusinessLicenseFile] = useState(null);

  const handleSelectICFront = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFrontFile(file);
      setPreviewICFront(URL.createObjectURL(file));
    }
  };

  const handleSelectICBack = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackFile(file);
      setPreviewICBack(URL.createObjectURL(file));
    }
  };

  const handleSelectBusinessLicense = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessLicenseFile(file);
      setPreviewBusinessLicense(URL.createObjectURL(file));
    }
  };
  const handleSave = () => {
    onUpdatePaperwork({
      ICFront: ICFrontFile,
      ICBack: ICBackFile,
      BusinessLicense: BusinessLicenseFile,
      ICFrontrUrl: previewICFront,
      ICBackUrl: previewICBack,
      BusinessLicenseUrl: previewBusinessLicense,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPreviewICFront(ICFrontUrl);
    setPreviewICBack(ICBackUrl);
    setPreviewBusinessLicense(BusinessLicenseUrl);
    setFrontFile(null);
    setBackFile(null);
    setBusinessLicenseFile(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Giấy tờ cửa hàng
        </h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CMND Mặt Trước */}
        <div>
          <p className="font-medium mb-2">CMND - Mặt trước</p>
          {previewICFront && (
            <img
              src={previewICFront}
              alt="CMND Mặt trước"
              className="w-full h-40 object-cover rounded-lg border"
            />
          )}
          {isEditing && (
            <label className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectICFront}
              />
            </label>
          )}
        </div>

        {/* CMND Mặt Sau */}
        <div>
          <p className="font-medium mb-2">CMND - Mặt sau</p>
          {previewICBack && (
            <img
              src={previewICBack}
              alt="CMND Mặt sau"
              className="w-full h-40 object-cover rounded-lg border"
            />
          )}
          {isEditing && (
            <label className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectICBack}
              />
            </label>
          )}
        </div>

        {/* Giấy phép kinh doanh */}
        <div>
          <p className="font-medium mb-2">Giấy phép kinh doanh</p>
          {previewBusinessLicense && (
            <img
              src={previewBusinessLicense}
              alt="Giấy phép kinh doanh"
              className="w-full h-40 object-cover rounded-lg border"
            />
          )}
          {isEditing && (
            <label className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectBusinessLicense}
              />
            </label>
          )}
        </div>
      </div>
      {/* Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4 mt-4">
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

export default StorePaperwork;
