"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import LabelWithIcon from "@/components/LableWithIcon";
import Modal from "@/components/Modal";
import { toast } from "react-toastify";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/service/category";
import { getErrorMessage } from "@/data/errorMessages";
import localStorageService from "@/utils/localStorageService";

const Page = () => {
  const storeData =
    typeof window !== "undefined" ? localStorage.getItem("store") : null;
  const [storeId, setStoreId] = useState(localStorageService.getStoreId());

  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await getAllCategories(storeId);
      setCategories(res?.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err.errorCode) || "Lỗi khi tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchCategories();
  }, [storeId]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await createCategory({ storeId, name: categoryName });
      toast.success("Tạo danh mục thành công");
      setIsModalOpen(false);
      setCategoryName("");
      await fetchCategories();
    } catch (err) {
      toast.error(getErrorMessage(err.errorCode) || "Tạo danh mục thất bại");
      console.error(err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!categoryName.trim() || !selectedCategory) return;

    try {
      await updateCategory(selectedCategory._id, {
        name: categoryName,
        storeId,
      });
      toast.success("Cập nhật danh mục thành công");
      setIsModalOpen(false);
      setCategoryName("");
      setSelectedCategory(null);
      await fetchCategories();
    } catch (err) {
      toast.error(
        getErrorMessage(err.errorCode) || "Cập nhật danh mục thất bại"
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory._id);
      toast.success("Xóa danh mục thành công");
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (err) {
      toast.error(getErrorMessage(err.errorCode) || "Xóa danh mục thất bại");
    }
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={
          selectedCategory ? handleUpdateCategory : handleCreateCategory
        }
        title={selectedCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
        confirmTitle="Lưu"
        closeTitle="Hủy"
      >
        <form
          onSubmit={
            selectedCategory ? handleUpdateCategory : handleCreateCategory
          }
        >
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nhập tên danh mục"
            className="w-full p-2 border rounded-md mb-4"
            required
          />
        </form>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Xác nhận xóa"
        confirmTitle="Xóa"
        closeTitle="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
      </Modal>

      <Header title="Chỉnh sửa danh mục" goBack={true} />
      <div className="flex justify-between items-center border-b pb-2 mx-4 mt-24">
        <LabelWithIcon
          title="Thêm"
          iconPath="/assets/plus.png"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div className="pt-4 pb-4 bg-gray-100 mt-4 h-full">
        {isLoading ? (
          <p className="text-center text-gray-500">Đang tải danh mục...</p>
        ) : (
          <div className="bg-white rounded-md p-2">
            {categories.map((item) => (
              <CategoryItem
                key={item._id}
                item={item}
                onEdit={() => {
                  setSelectedCategory(item);
                  setCategoryName(item.name);
                  setIsModalOpen(true);
                }}
                onDelete={() => {
                  setSelectedCategory(item);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const CategoryItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-md my-2">
      <p className="font-semibold">{item.name}</p>
      <div className="flex space-x-2">
        <button onClick={onEdit} className="text-blue-500">
          ✏️
        </button>
        <button onClick={onDelete} className="text-red-500">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Page;
