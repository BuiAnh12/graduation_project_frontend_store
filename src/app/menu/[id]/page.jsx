"use client";

import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  createDish,
  updateDish,
  getDishById,
  deleteDish,
} from "@/service/dish";
import { getAllToppingsGroupByStore } from "@/service/topping";
import { getAllCategories } from "@/service/category";
import { getAllTags, predictTags } from "@/service/tags";
import { uploadImage } from "@/service/upload";
import localStorageService from "@/utils/localStorageService";

const DishForm = () => {
  const router = useRouter();
  const { id } = useParams(); // ✅ id trong route
  const [storeId] = useState(localStorageService.getStoreId());

  const [loading, setLoading] = useState(false);
  const [allToppings, setAllToppings] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [cookingMethodTags, setCookingMethodTags] = useState([]);
  const [cultureTags, setCultureTags] = useState([]);
  const [foodTags, setFoodTags] = useState([]);
  const [tasteTags, setTasteTags] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stockCount: 0,
  });
  const [selectedTags, setSelectedTags] = useState({
    cookingMethod: new Set(),
    culture: new Set(),
    food: new Set(),
    taste: new Set(),
  });
  const [showModal, setShowModal] = useState(false);

  // ---------- FETCH DATA ----------
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories(storeId);
      setAllCategories(res?.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh mục");
      console.error(err);
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
      toast.error("Lỗi khi tải thẻ");
      console.error(err);
    }
  };

  const fetchToppings = async () => {
    try {
      const res = await getAllToppingsGroupByStore(storeId);
      setAllToppings(res?.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải topping");
      console.error(err);
    }
  };

  const fetchDishDetail = async (dishId) => {
    if (!dishId) return;
    setLoading(true);
    try {
      const res = await getDishById(storeId, dishId);
      const data = res?.data;

      setFormData({
        name: data.name || "",
        price: data.price || "",
        description: data.description || "",
        category: data.category?._id || "",
        stockCount: data.stockCount,
      });

      // Map tags -> set of tag IDs (use _id from API)
      setSelectedTags({
        cookingMethod: new Set(
          data.cookingMethodtags?.map((tag) => tag._id) || []
        ),
        culture: new Set(data.cultureTags?.map((tag) => tag._id) || []),
        food: new Set(data.dishTags?.map((tag) => tag._id) || []),
        taste: new Set(data.tasteTags?.map((tag) => tag._id) || []),
      });

      // New API returns toppingGroups (each group has _id). Use group ids as selected topping groups.
      if (Array.isArray(data.toppingGroups)) {
        setSelectedToppings(new Set(data.toppingGroups.map((g) => g._id)));
      } else {
        // fallback if older field exists
        setSelectedToppings(new Set(data.toppings || []));
      }

      // Image may have url or file_path -> prefer url, fallback to file_path
      if (data.image) {
        setPreviewUrl(data.image.url || data.image.file_path || null);
        setImage(data.image._id || null);
      }
    } catch (err) {
      toast.error("Không thể tải chi tiết món ăn");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchCategories();
      fetchToppings();
    }
    fetchTags();
  }, [storeId]);

  useEffect(() => {
    if (id) fetchDishDetail(id);
  }, [id]);

  // ---------- HANDLERS ----------
  const handleTagToggle = (type, tagId) => {
    setSelectedTags((prev) => {
      const updated = new Set(prev[type]);
      if (updated.has(tagId)) updated.delete(tagId);
      else updated.add(tagId);
      return { ...prev, [type]: updated };
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
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
      if (updatedSet.has(toppingId)) updatedSet.delete(toppingId);
      else updatedSet.add(toppingId);
      return updatedSet;
    });
  };

  const handleSave = () => {
    setShowModal(true);
  };

  const confirmSave = async () => {
    setShowModal(false);
    let uploadedImage = image;

    // Nếu có upload ảnh mới thì upload
    if (imageFile) {
      try {
        const res = await uploadImage(imageFile);
        uploadedImage = res?.id;
      } catch (err) {
        toast.error("Không thể tải ảnh lên");
        return;
      }
    }

    // Chuẩn hóa dữ liệu gửi lên backend
    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      image: uploadedImage,
      dishTags: Array.from(selectedTags.food),
      tasteTags: Array.from(selectedTags.taste),
      cookingMethodtags: Array.from(selectedTags.cookingMethod),
      cultureTags: Array.from(selectedTags.culture),
      toppingGroupIds: Array.from(selectedToppings),
      stockStatus: "available",
      stockCount: formData.stockCount,
    };

    try {
      if (id) {
        // ✅ Sửa lại truyền storeId + dishId cho đúng với backend
        await updateDish(storeId, id, payload);
        toast.success("Cập nhật món ăn thành công!");
      } else {
        await createDish(storeId, payload);
        toast.success("Tạo món ăn thành công!");
      }
      router.back();
    } catch (err) {
      console.error("Lưu thất bại:", err);
      toast.error("Không thể lưu món ăn");
    }
  };

  const handleDelete = async () => {
    if (!id) {
      toast.warning("Không thể xóa món ăn mới chưa lưu!");
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa món ăn này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deleteDish(storeId, id);
        await Swal.fire({
          title: "Đã xóa!",
          text: "Món ăn đã được xóa thành công.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        router.back();
      } catch (err) {
        console.error("Lỗi khi xóa món ăn:", err);
        Swal.fire({
          title: "Lỗi!",
          text: "Không thể xóa món ăn. Vui lòng thử lại.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      } finally {
        setLoading(false);
      }
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

  // ---------- UI ----------
  return (
    <>
      <Header title="Cập nhật món ăn" goBack={true} />
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

            <div className="flex justify-between mt-4 items-center">
              <label className="flex-1 block text-sm font-semibold text-gray-700">
                Số phần còn lại
              </label>
              <input
                type="number"
                name="stockCount"
                value={formData.stockCount}
                min="0"
                onChange={handleChange}
                className="flex-1 p-2 ring-1 ring-gray-300 my-2 rounded-md outline-none focus:ring-[#fc6011]"
              />
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

          <div className="flex justify-between w-full items-center">
            <button
              onClick={handleDelete}
              className="text-white  p-3 px-10 text-md font-semibold rounded-lg bg-red-500"
            >
              Xóa
            </button>
            <button
              onClick={handleSave}
              className="text-white  p-3 px-10 text-md font-semibold rounded-lg bg-[#fc6011]"
            >
              Cập nhật
            </button>
          </div>

          {showModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-10"
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
                    Cập nhật
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

export default DishForm;
