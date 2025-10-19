"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createDish } from "@/service/dish";
import { getAllToppingsGroupByStore } from "@/service/topping";
import { getAllCategories } from "@/service/category";
import { getAllTags, predictTags } from "@/service/tags";
import { uploadImage } from "@/service/upload";
import localStorageService from "@/utils/localStorageService";

const CreateDish = () => {
  const router = useRouter();
  const [storeId, setStoreId] = useState(localStorageService.getStoreId());

  const [allToppings, setAllToppings] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [cookingMethodTags, setCookingMethodTags] = useState([]);
  const [cultureTags, setCultureTags] = useState([]);
  const [foodTags, setFoodTags] = useState([]);
  const [tasteTags, setTasteTags] = useState([]);
  // State cho ảnh: giữ cả file và preview
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [selectedTags, setSelectedTags] = useState({
    cookingMethod: new Set(),
    culture: new Set(),
    food: new Set(),
    taste: new Set(),
  });
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories(storeId);
      setAllCategories(res?.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục");
      console.error(err);
    } finally {
    }
  };

  const fetchTags = async () => {
    try {
      const res = await getAllTags();
      setCookingMethodTags(res?.data.cookingMethodTags || []);
      setCultureTags(res?.data.cultureTags || []);
      setFoodTags(res?.data.foodTags || []);
      setTasteTags(res?.data.tasteTags || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục");
      console.error(err);
    } finally {
    }
  };

  const fetchToppings = async () => {
    try {
      const res = await getAllToppingsGroupByStore(storeId);
      setAllToppings(res?.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục");
      console.error(err);
    } finally {
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchCategories();
      fetchToppings();
    }
  }, [storeId]);

  useEffect(() => {
    fetchTags();
  }, []);
  const handleTagToggle = (type, tagId) => {
    setSelectedTags((prev) => {
      const updated = new Set(prev[type]);
      if (updated.has(tagId)) {
        updated.delete(tagId);
      } else {
        updated.add(tagId);
      }
      return { ...prev, [type]: updated };
    });
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Lưu file để upload
      setImage(file); // Cập nhật state image
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToppingToggle = (toppingId) => {
    setSelectedToppings((prev) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(toppingId)) {
        updatedSet.delete(toppingId);
      } else {
        updatedSet.add(toppingId);
      }
      return updatedSet;
    });
  };

  const handleSave = () => {
    setShowModal(true);
  };

  const confirmSave = async () => {
    setShowModal(false);
    let uploadedImage = null;

    if (imageFile) {
      try {
        const res = await uploadImage(imageFile);
        uploadedImage = res?.id;
      } catch (err) {
        toast.error("Không thể tải ảnh lên");
        return;
      }
    }

    const newDishData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      image: uploadedImage,
      dishTags: Array.from(selectedTags.food),
      tasteTags: Array.from(selectedTags.taste),
      cookingMethodtags: Array.from(selectedTags.cookingMethod),
      cultureTags: Array.from(selectedTags.culture),
      stockStatus: "available",
      stockCount: -1,

      // ✅ Gửi danh sách topping group id lên backend
      toppingGroupIds: Array.from(selectedToppings),
    };

    try {
      await createDish(storeId, newDishData);
      toast.success("Tạo món ăn thành công!");
      router.back();
    } catch (err) {
      console.error("Tạo món ăn thất bại:", err);
      toast.error("Không thể tạo món ăn");
    }
  };

  const handleAutoTag = async () => {
    if (!imageFile) {
      toast.warning("Vui lòng chọn ảnh trước khi gợi ý thẻ!");
      return;
    }

    try {
      toast.info("Đang phân tích ảnh...");

      const res = await predictTags(imageFile);
      const postProcess = res?.post_preocess || [];

      // Tạo map các set mới cho từng loại tag
      const newSelected = {
        cookingMethod: new Set(selectedTags.cookingMethod),
        culture: new Set(selectedTags.culture),
        food: new Set(selectedTags.food),
        taste: new Set(selectedTags.taste),
      };

      postProcess.forEach((group) => {
        group.tags.forEach((tag) => {
          switch (tag.type) {
            case "food":
              newSelected.food.add(tag._id);
              break;
            case "culture":
              newSelected.culture.add(tag._id);
              break;
            case "cooking_method":
              newSelected.cookingMethod.add(tag._id);
              break;
            case "taste":
              newSelected.taste.add(tag._id);
              break;
            default:
              break;
          }
        });
      });

      setSelectedTags(newSelected);
      toast.success("Đã gợi ý thẻ thành công!");
    } catch (err) {
      console.error("Predict tags failed:", err);
      toast.error("Không thể gợi ý thẻ tự động");
    }
  };

  return (
    <>
      <Header title="Thêm món ăn" goBack={true} />
      <div className="w-full px-5 py-6 mt-12 mb-24">
        <div className="flex-1 overflow-auto space-y-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700">
              Hình ảnh
            </label>
            <div className="relative mt-3 w-24 h-24 rounded-md border flex items-center justify-center bg-gray-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Uploaded"
                  className="w-full h-full rounded-md object-cover"
                />
              ) : (
                <span className="text-gray-400">Chưa có ảnh</span>
              )}
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => document.getElementById("imageUpload").click()}
                className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md hover:bg-gray-900 transition"
              >
                Sửa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            {[
              { label: "Tên*", name: "name", type: "text" },
              { label: "Giá*", name: "price", type: "number" },
              {
                label: "Mô tả",
                name: "description",
                type: "text",
              },
            ].map((field, index) => (
              <div key={index} className="border-b pb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full p-2 ring-1 ring-gray-300 my-2 rounded-md outline-none focus:ring-[#fc6011]"
                />
              </div>
            ))}
            <div className="border-b pb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Danh mục*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 ring-1 ring-gray-300 my-2 rounded-md outline-none focus:ring-[#fc6011]"
              >
                <option value="">Chọn danh mục</option>
                {allCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Topping của cửa hàng
            </h3>
            {allToppings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allToppings.map((topping) => (
                  <label
                    key={topping._id}
                    className="flex items-center gap-3 p-2 border rounded-md shadow-sm hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppings.has(topping._id)}
                      onChange={() => handleToppingToggle(topping._id)}
                    />
                    {topping.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Không có topping nào</p>
            )}
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold">Tags</p>
            <button
              onClick={handleAutoTag}
              disabled={!imageFile}
              className={`text-xs px-3 py-2 rounded-md shadow-md transition ${
                imageFile
                  ? "bg-[#fc6011] text-white hover:bg-[#e7560f]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Gợi ý thẻ
            </button>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Phương pháp nấu
            </h3>
            <div className="flex flex-wrap gap-2">
              {cookingMethodTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagToggle("cookingMethod", tag._id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
          ${
            selectedTags.cookingMethod.has(tag._id)
              ? "bg-green-500 text-white border-green-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Văn hóa</h3>
            <div className="flex flex-wrap gap-2">
              {cultureTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagToggle("culture", tag._id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
          ${
            selectedTags.culture.has(tag._id)
              ? "bg-green-500 text-white border-green-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Thành phần</h3>
            <div className="flex flex-wrap gap-2">
              {foodTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagToggle("food", tag._id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
          ${
            selectedTags.food.has(tag._id)
              ? "bg-green-500 text-white border-green-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Hương vị</h3>
            <div className="flex flex-wrap gap-2">
              {tasteTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagToggle("taste", tag._id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200
          ${
            selectedTags.taste.has(tag._id)
              ? "bg-green-500 text-white border-green-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end w-full items-center">
            <button
              onClick={handleSave}
              className="text-white p-3 px-10 text-md font-semibold rounded-lg bg-[#fc6011]"
            >
              Lưu
            </button>
          </div>

          {showModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white p-5 rounded-lg shadow-lg p-10"
                onClick={(e) => e.stopPropagation()}
              >
                <p>Bạn có chắc chắn muốn lưu?</p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={confirmSave}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateDish;
