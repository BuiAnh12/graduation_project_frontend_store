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
import { getAllTags } from "@/service/tags";
import {
  generateNewDesciption,
  predictTagsFromImage,
  predictTagsFromText,
} from "@/service/recommend";
import { uploadImage } from "@/service/upload";
import localStorageService from "@/utils/localStorageService";
import { getErrorMessage } from "@/data/errorMessages";
import TagSection from "@/components/fragments/TagSection";
const DishForm = () => {
  const router = useRouter();
  const { id } = useParams(); // ✅ id trong route
  const [storeId] = useState(localStorageService.getStoreId());
  const [stockMode, setStockMode] = useState("limited");
  // "limited" | "unlimited"
  const [loading, setLoading] = useState(false);
  const [allToppings, setAllToppings] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [cookingMethodTags, setCookingMethodTags] = useState([]);
  const [cultureTags, setCultureTags] = useState([]);
  const [foodTags, setFoodTags] = useState([]);
  const [tasteTags, setTasteTags] = useState([]);
  const [newDescription, setNewDescription] = useState(null);
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

  // ---------- FETCH DATA ----------
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories(storeId);
      setAllCategories(res?.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err.errorCode) || "Lỗi khi tải danh mục");
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
      toast.error(getErrorMessage(err.errorCode) || "Lỗi khi tải thẻ");
    }
  };

  const fetchToppings = async () => {
    try {
      const res = await getAllToppingsGroupByStore(storeId);
      setAllToppings(res?.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err.errorCode) || "Lỗi khi tải topping");
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

      setStockMode(data.stockCount === -1 ? "unlimited" : "limited");

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
      toast.error(
        getErrorMessage(err.errorCode) || "Không thể tải chi tiết món ăn"
      );
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

  const confirmSave = async () => {
    // Validate các trường bắt buộc
    if (!formData.name?.trim()) {
      toast.error("Vui lòng nhập tên món ăn");
      return;
    }
    if (stockMode === "limited" && formData.stockCount < 0) {
      toast.error("Số lượng phải >= 0");
      return;
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      toast.error("Vui lòng nhập giá");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }
    if (!formData.category) {
      toast.error("Vui lòng chọn danh mục");
      return;
    }

    // Xác nhận trước khi lưu
    const result = await Swal.fire({
      title: "Xác nhận",
      text: id
        ? "Bạn có chắc muốn cập nhật món ăn này không?"
        : "Bạn có chắc muốn tạo món ăn này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    let uploadedImage = image; // giữ image hiện tại nếu không upload mới

    if (imageFile) {
      try {
        const res = await uploadImage(imageFile);
        uploadedImage = res?.id;
      } catch (err) {
        Swal.fire("Lỗi", "Không thể tải ảnh lên", "error");
        return;
      }
    }

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
      stockCount: formData.stockCount ?? -1,
    };

    try {
      if (id) {
        await updateDish(storeId, id, payload); // update
        Swal.fire("Thành công", "Cập nhật món ăn thành công!", "success");
      } else {
        await createDish(storeId, payload); // create
        Swal.fire("Thành công", "Tạo món ăn thành công!", "success");
      }
      router.back();
    } catch (err) {
      Swal.fire(
        "Lỗi",
        getErrorMessage(err.errorCode) || "Không thể lưu món ăn",
        "error"
      );
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

  const USE_IMAGE = false;
  const USE_TEXT = true;
  const handleAutoTag = async () => {
    if (!imageFile && USE_IMAGE) {
      toast.warning("Vui lòng chọn ảnh trước khi gợi ý thẻ!");
      return;
    }

    try {
      toast.info("Đang phân tích dữ liệu...");
      const [imgRes, textRes] = await Promise.all([
        USE_IMAGE ? predictTagsFromImage(imageFile).catch(() => null) : null,
        USE_TEXT
          ? predictTagsFromText({
              name: formData.name,
              description: formData.description,
            }).catch(() => null)
          : null,
      ]);

      console.log("IMAGE_RES:", imgRes);
      console.log("TEXT_RES:", textRes);

      const textProcessed = textRes ? textRes.data.enriched_result || [] : [];

      const imageProcessed = imgRes ? imgRes.data.post_process || [] : [];

      // Gom tag lại
      const combined = [...imageProcessed, ...textProcessed];

      console.log("COMBINED:", combined);

      // Copy struct set
      const newSelected = {
        cookingMethod: new Set(selectedTags.cookingMethod),
        culture: new Set(selectedTags.culture),
        food: new Set(selectedTags.food),
        taste: new Set(selectedTags.taste),
      };

      // Nhận dạng tất cả tag + add vào state
      combined.forEach((group) => {
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
      toast.error("Không thể gợi ý thẻ tự động");
    }
  };

  const handleSuggestDescription = async () => {
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Vui lòng nhập tên sản phẩm trước khi tạo mô tả!");
      return;
    }
    try {
      toast.info("Đang tạo mô tả mới...");
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      const res = await generateNewDesciption(payload);

      setNewDescription(res.data.new_description);
      toast.success("Tạo mô tả thành công!");
    } catch (err) {
      console.log(err);
      toast.error(
        getErrorMessage(err.errorCode) || "Không thể gợi ý thẻ tự động"
      );
    }
  };
  const isAnyTagSelected =
    selectedTags.cookingMethod.size > 0 ||
    selectedTags.culture.size > 0 ||
    selectedTags.food.size > 0 ||
    selectedTags.taste.size > 0;

  const clearAllTags = () => {
    setSelectedTags({
      cookingMethod: new Set(),
      culture: new Set(),
      food: new Set(),
      taste: new Set(),
    });
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

            <div className="mt-4 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Số phần còn lại
              </label>

              <div className="flex md:flex-row flex-col gap-4">
                {/* Select */}
                <select
                  value={stockMode}
                  onChange={(e) => {
                    const mode = e.target.value;
                    setStockMode(mode);
                    setFormData((prev) => ({
                      ...prev,
                      stockCount: mode === "unlimited" ? -1 : 0,
                    }));
                  }}
                  className="w-full p-2 ring-1 ring-gray-300 rounded-md border"
                >
                  <option value="limited">Có giới hạn</option>
                  <option value="unlimited">Không giới hạn</option>
                </select>

                {/* Input chỉ hiện khi có giới hạn */}
                {stockMode === "limited" && (
                  <input
                    type="number"
                    min={0}
                    value={formData.stockCount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stockCount: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full p-2 ring-1 ring-gray-300 rounded-md outline-none focus:ring-[#fc6011]"
                    placeholder="Nhập số lượng"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            {[
              { label: "Tên*", name: "name", type: "text" },
              { label: "Giá*", name: "price", type: "number" },
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
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Mô tả
                </label>
                <button
                  onClick={handleSuggestDescription}
                  className="mt-2 bg-[#fc6011] text-white px-3 py-2 rounded-md text-xs"
                >
                  Gợi ý mô tả mới
                </button>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 ring-1 ring-gray-300 my-2 rounded-md outline-none focus:ring-[#fc6011]"
              />
            </div>
            {newDescription && (
              <div className="bg-white shadow-md p-4 rounded-lg border border-gray-300 mt-3 space-y-3">
                <p className="font-semibold text-gray-700">Mô tả gợi ý</p>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Mô tả hiện tại</p>
                    <div className="p-2 border rounded bg-gray-50 text-sm">
                      {formData.description}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Mô tả mới</p>
                    <div className="p-2 border rounded bg-orange-50 text-sm">
                      {newDescription}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setNewDescription(null)}
                    className="flex-1 py-2 rounded-md border text-gray-700 text-sm"
                  >
                    Giữ mô tả cũ
                  </button>

                  <button
                    onClick={() => {
                      setFormData({ ...formData, description: newDescription });
                      setNewDescription(null);
                    }}
                    className="flex-1 py-2 bg-[#fc6011] text-white rounded-md text-sm"
                  >
                    Dùng mô tả mới
                  </button>
                </div>
              </div>
            )}
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
              className="text-xs px-3 py-2 rounded-md shadow-md transitionbg-[#fc6011] text-white bg-[#fc6011]  "
            >
              Gợi ý thẻ
            </button>
          </div>

          <div className="flex flex-col gap-4 justify-start">
            {isAnyTagSelected && (
              <button
                onClick={clearAllTags}
                className="text-xs font-semibold px-4 py-2 bg-red-500 text-white rounded-lg w-[120px]"
              >
                Bỏ chọn tất cả
              </button>
            )}
            <TagSection
              title="Thành phần"
              tags={foodTags}
              selectedSet={selectedTags.food}
              onToggle={(id) => handleTagToggle("food", id)}
            />
            <TagSection
              title="Văn hoá"
              tags={cultureTags}
              selectedSet={selectedTags.culture}
              onToggle={(id) => handleTagToggle("culture", id)}
            />
            <TagSection
              title="Hương vị"
              tags={tasteTags}
              selectedSet={selectedTags.taste}
              onToggle={(id) => handleTagToggle("taste", id)}
            />
            <TagSection
              title="Cách chế biến"
              tags={cookingMethodTags}
              selectedSet={selectedTags.cookingMethod}
              onToggle={(id) => handleTagToggle("cookingMethod", id)}
            />
          </div>
          <div className="flex justify-between w-full items-center">
            <button
              onClick={handleDelete}
              className="text-white py-2 px-6 text-md font-semibold rounded-lg bg-red-500"
            >
              Xóa
            </button>
            <button
              onClick={confirmSave}
              className="text-white py-2 px-6 text-md font-semibold rounded-lg bg-[#fc6011]"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DishForm;
