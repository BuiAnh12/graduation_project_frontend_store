"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import LabelWithIcon from "@/components/LableWithIcon";
import {
  getToppings,
  addToppingToGroup,
  removeToppingFromGroup,
  updateTopping,
  removeToppingGroup,
} from "@/service/topping";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const { id: groupId } = useParams();
  const router = useRouter();

  const [toppingGroup, setToppingGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddToppingModalOpen, setIsAddToppingModalOpen] = useState(false);
  const [selectedTopping, setSelectedTopping] = useState(null);

  const [newToppingName, setNewToppingName] = useState("");
  const [newToppingPrice, setNewToppingPrice] = useState("");

  const fetchToppings = async () => {
    try {
      setIsLoading(true);
      const res = await getToppings(groupId);

      const toppings = res?.data || [];
      const groupInfo = toppings[0]?.topping_groups || null;

      setToppingGroup({
        ...groupInfo,
        toppings,
      });
    } catch (err) {
      console.error("Failed to fetch toppings:", err);
      setError("Lỗi khi tải dữ liệu topping");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchToppings();
  }, [groupId]);

  const openEditModal = (topping) => {
    setSelectedTopping(topping);
    setNewToppingName(topping.name);
    setNewToppingPrice(topping.price.toString());
    setIsEditModalOpen(true);
  };

  const handleUpdateTopping = async () => {
    if (!selectedTopping || !newToppingName.trim() || !newToppingPrice.trim())
      return;
    try {
      await updateTopping(selectedTopping._id, {
        toppingGroupId: groupId,
        name: newToppingName,
        price: parseFloat(newToppingPrice),
      });
      await fetchToppings();
      setIsEditModalOpen(false);
      toast.success("Cập nhật topping thành công!");
    } catch (err) {
      console.error("Failed to update topping:", err);
      toast.error("Lỗi khi cập nhật topping!");
    }
  };

  const handleAddTopping = async () => {
    if (!newToppingName.trim() || !newToppingPrice.trim()) return;
    try {
      await addToppingToGroup({
        toppingGroupId: groupId,
        name: newToppingName,
        price: parseFloat(newToppingPrice),
      });
      await fetchToppings();
      setIsAddToppingModalOpen(false);
      setNewToppingName("");
      setNewToppingPrice("");
      toast.success("Thêm topping thành công!");
    } catch (err) {
      console.error("Failed to add topping:", err);
      toast.error("Lỗi khi thêm topping!");
    }
  };

  const handleRemoveTopping = async (toppingId) => {
    try {
      await removeToppingFromGroup(toppingId);
      await fetchToppings();
      toast.success("Xóa topping thành công!");
    } catch (err) {
      console.error("Failed to remove topping:", err);
      toast.error("Lỗi khi xóa topping!");
    }
  };

  const handleDeleteToppingGroup = async () => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa nhóm topping này?"
    );
    if (!confirmDelete) return;

    try {
      await removeToppingGroup(groupId);
      toast.success("Xóa nhóm topping thành công!");
      router.push("/menu");
    } catch (err) {
      console.error("Failed to delete topping group:", err);
      toast.error("Đã xảy ra lỗi khi xóa nhóm topping!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Edit Topping Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleUpdateTopping}
        title="Chỉnh sửa Topping"
        confirmTitle="Lưu"
        closeTitle="Hủy"
      >
        <input
          type="text"
          value={newToppingName}
          onChange={(e) => setNewToppingName(e.target.value)}
          placeholder="Nhập tên mới"
          className="w-full p-2 border rounded-md mb-4"
          required
        />
        <input
          type="number"
          value={newToppingPrice}
          onChange={(e) => setNewToppingPrice(e.target.value)}
          placeholder="Nhập giá mới"
          className="w-full p-2 border rounded-md"
          required
        />
      </Modal>

      {/* Add New Topping Modal */}
      <Modal
        open={isAddToppingModalOpen}
        onClose={() => setIsAddToppingModalOpen(false)}
        onConfirm={handleAddTopping}
        title="Thêm Topping Mới"
        confirmTitle="Thêm"
        closeTitle="Hủy"
      >
        <input
          type="text"
          value={newToppingName}
          onChange={(e) => setNewToppingName(e.target.value)}
          placeholder="Nhập tên topping"
          className="w-full p-2 border rounded-md mb-4"
          required
        />
        <input
          type="number"
          value={newToppingPrice}
          onChange={(e) => setNewToppingPrice(e.target.value)}
          placeholder="Nhập giá topping"
          className="w-full p-2 border rounded-md"
          required
        />
      </Modal>

      <Header title={toppingGroup.name || "Nhóm Topping"} goBack={true} />

      <div className="flex justify-between items-center mx-4 mt-24">
        <LabelWithIcon
          title="Thêm"
          iconPath="/assets/plus.png"
          onClick={() => setIsAddToppingModalOpen(true)}
        />
        <button
          className="bg-red-600 text-white text-sm px-4 py-2 rounded-md"
          onClick={handleDeleteToppingGroup}
        >
          Xóa nhóm topping
        </button>
      </div>

      <div className="pt-2 pb-2 bg-gray-100 mt-4">
        <div className="bg-white rounded-md p-2">
          {toppingGroup.toppings.map((topping) => (
            <ToppingItem
              key={topping._id}
              item={topping}
              openEditModal={openEditModal}
              onRemove={handleRemoveTopping}
            />
          ))}
        </div>
      </div>
    </>
  );
};
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
};
const ToppingItem = ({ item, openEditModal, onRemove }) => (
  <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-md my-2">
    <p className="font-semibold">{item.name}</p>
    <div className="flex items-center space-x-3">
      <p className="text-gray-500 mr-4">{formatCurrency(item.price)}</p>
      <button
        onClick={() => openEditModal(item)}
        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
      >
        Sửa
      </button>
      <button
        onClick={() => onRemove(item._id)}
        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
      >
        Xóa
      </button>
    </div>
  </div>
);

export default Page;
