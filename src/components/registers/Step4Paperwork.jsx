"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
const Step4Paperwork = ({ files, setFiles, nextStep, prevStep }) => {
  const ICFrontInputRef = useRef(null);
  const ICBackInputRef = useRef(null);
  const businessLicenseInputRef = useRef(null);
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "icFront") {
      setFiles((prev) => ({ ...prev, ICFrontFile: file }));
    } else if (type === "icBack") {
      setFiles((prev) => ({ ...prev, ICBackFile: file }));
    } else if (type === "business") {
      setFiles((prev) => ({ ...prev, BusinessLicenseFile: file }));
    }
  };

  const handleNext = async () => {
    if (!files.ICFrontFile || !files.ICBackFile || !files.BusinessLicenseFile) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    } else {
      toast.success("Thành cônng");
      nextStep();
      return;
    }
  };

  return (
    <div className="w-full rounded-2xl border m-2 border-gray-100 bg-white p-6 md:p-10 lg:p-16 shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Bổ sung giấy tờ
      </h2>

      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div className="flex gap-10 justify-between flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Căn cước công dân mặt trước
            </label>
            <button
              type="button"
              onClick={() => ICFrontInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-gray-300 transition h-[40px] w-[100px]"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={ICFrontInputRef}
              onChange={(e) => handleFileChange(e, "icFront")}
              className="hidden"
            />
          </div>
          {files.ICFrontFile && (
            <img
              src={URL.createObjectURL(files.ICFrontFile)}
              alt="ICFront Preview"
              className="w-50 h-25 mt-2"
            />
          )}
        </div>

        <div className="flex justify-between flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Căn cước công dân mặt sau
            </label>
            <button
              type="button"
              onClick={() => ICBackInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-gray-300 transition h-[40px] w-[100px]"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={ICBackInputRef}
              onChange={(e) => handleFileChange(e, "icBack")}
              className="hidden"
            />
          </div>
          {files.ICBackFile && (
            <img
              src={URL.createObjectURL(files.ICBackFile)}
              alt="ICBack Preview"
              className="w-50 h-25 mt-2"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-10 mt-10">
        <div className="flex justify-between flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giấy phép kinh doanh
            </label>
            <button
              type="button"
              onClick={() => businessLicenseInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-gray-300 transition h-[40px] w-[100px]"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={businessLicenseInputRef}
              onChange={(e) => handleFileChange(e, "business")}
              className="hidden"
            />
          </div>
          {files.BusinessLicenseFile && (
            <img
              src={URL.createObjectURL(files.BusinessLicenseFile)}
              alt="Bussiness Preview"
              className="w-25 h-40 mt-2"
            />
          )}
        </div>
        <div className="flex justify-between flex-1"></div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={prevStep}
          className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition cursor-pointer"
        >
          Quay lại
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-white font-semibold shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Step4Paperwork;
