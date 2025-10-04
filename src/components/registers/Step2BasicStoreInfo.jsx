"use client";
import React, { useEffect, useRef, useState } from "react";
import { getAllSystemCategories } from "@/service/systemCategory";
import { toast } from "react-toastify";
const Step2BasicStoreInfo = ({
  data,
  setData,
  files,
  setFiles,
  nextStep,
  prevStep,
}) => {
  const [categories, setCategories] = useState([]);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const fetchSystemCategories = async () => {
      try {
        const response = await getAllSystemCategories();

        console.log(response);
        setCategories(response.data);
      } catch (error) {
        console.error("Không thể tải danh mục cửa hàng:", error);
      }
    };

    fetchSystemCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryCheckbox = (categoryId) => {
    const prevCategories = data.systemCategoryId || [];
    const isSelected = prevCategories.some((cat) => cat._id === categoryId);

    if (isSelected) {
      setData({
        ...data,
        systemCategoryId: prevCategories.filter(
          (cat) => cat._id !== categoryId
        ),
      });
    } else {
      const categoryObj = categories.find((cat) => cat._id === categoryId);
      if (categoryObj) {
        setData({
          ...data,
          systemCategoryId: [...prevCategories, categoryObj],
        });
      }
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "avatar") {
      setFiles((prev) => ({ ...prev, avatarFile: file }));
    } else if (type === "cover") {
      setFiles((prev) => ({ ...prev, coverFile: file }));
    }
  };

  const handleNext = async () => {
    if (
      !data.name ||
      !data.description ||
      !data.openHour ||
      !data.closeHour ||
      !data.systemCategoryId ||
      !files.avatarFile ||
      !files.coverFile
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    } else {
      toast.success("Thành cônng");
      nextStep();
      return;
    }
  };

  return (
    <div className="w-full max-w-none rounded-2xl border m-2 border-gray-100 bg-white p-8 md:px-12 lg:px-20 xl:px-32 shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Thông tin cửa hàng
      </h2>

      <div className="flex flex-col gap-4">
        {/* Tên cửa hàng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên cửa hàng
          </label>
          <input
            type="text"
            name="name"
            value={data.name || ""}
            onChange={handleChange}
            placeholder="Nhập tên cửa hàng"
            className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            name="description"
            value={data.description || ""}
            onChange={handleChange}
            placeholder="Giới thiệu ngắn về cửa hàng"
            className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 justify-between">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ mở cửa
            </label>
            <input
              type="time"
              name="openHour"
              value={data.openHour || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="60"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ đóng cửa
            </label>
            <input
              type="time"
              name="closeHour"
              value={data.closeHour || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="60"
            />
          </div>
        </div>

        {/* Danh mục cửa hàng */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục cửa hàng
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={data.systemCategoryId?.some(
                    (c) => c._id === cat._id
                  )}
                  onChange={() => handleCategoryCheckbox(cat._id)}
                  className="accent-blue-600"
                />
                <span className="text-black">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Avatar */}
        <div className="flex gap-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-gray-300 transition h-[40px] w-[100px]"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={(e) => handleFileChange(e, "avatar")}
              className="hidden"
            />
          </div>

          {files.avatarFile && (
            <img
              src={URL.createObjectURL(files.avatarFile)}
              alt="Avatar Preview"
              className="w-24 h-24 object-cover rounded-full mt-2"
            />
          )}
        </div>

        {/* Cover */}
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh bìa
            </label>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-gray-300 transition h-[40px] w-[100px]"
            >
              Chọn ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={(e) => handleFileChange(e, "cover")}
              className="hidden"
            />
          </div>
          {files.coverFile && (
            <img
              src={URL.createObjectURL(files.coverFile)}
              alt="Cover Preview"
              className="w-full h-32 object-cover rounded-lg mt-2"
            />
          )}
        </div>
      </div>

      {/* Buttons */}
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

export default Step2BasicStoreInfo;
