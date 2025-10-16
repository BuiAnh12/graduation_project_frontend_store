"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LabelWithIcon from "@/components/LableWithIcon";
import Modal from "../Modal";
import {
  getAllToppingsGroupByStore,
  createToppingGroup,
  updateToppingGroup,
} from "@/service/topping";
import Loading from "@/components/Loading";
import localStorageService from "@/utils/localStorageService";
import { FaPen } from "react-icons/fa";

const ToppingMenuTab = () => {
  const router = useRouter();
  const storeId = localStorageService.getStoreId();

  const [toppingGroups, setToppingGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [onlyOnce, setOnlyOnce] = useState(false);
  const fetchToppings = async () => {
    try {
      setIsLoading(true);
      const response = await getAllToppingsGroupByStore(storeId);
      setToppingGroups(response?.data || []);
    } catch (err) {
      console.error("Error fetching toppings:", err);
      setError("Lỗi khi tải topping");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToppings();
  }, [storeId]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setGroupName("");
    setOnlyOnce(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group) => {
    setIsEditMode(true);
    setGroupName(group.name);
    setOnlyOnce(group.onlyOnce || false);
    setCurrentGroupId(group._id);
    setIsModalOpen(true);
  };

  const handleSaveGroup = async () => {
    if (!groupName.trim()) return;

    try {
      if (isEditMode) {
        await updateToppingGroup(currentGroupId, { name: groupName, onlyOnce });
      } else {
        await createToppingGroup({ storeId, name: groupName, onlyOnce });
      }

      setIsModalOpen(false);
      setGroupName("");
      setOnlyOnce(false);
      await fetchToppings();
    } catch (err) {
      console.error("Failed to save topping group:", err);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full p-4">
      {/* Modal thêm/sửa nhóm */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSaveGroup}
        title={isEditMode ? "Chỉnh sửa Nhóm Topping" : "Thêm Nhóm Topping"}
        confirmTitle="Lưu"
        closeTitle="Hủy"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nhập tên nhóm topping"
            className="w-full p-2 border rounded-md"
            required
          />

          {/* ✅ Checkbox OnlyOnce */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyOnce}
              onChange={(e) => setOnlyOnce(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
            <span className="text-gray-700">
              Chỉ được chọn 1 topping trong nhóm này
            </span>
          </label>
        </div>
      </Modal>

      <div className="flex justify-between items-center border-b pb-2 mx-3">
        <LabelWithIcon
          title="Thêm nhóm"
          iconPath="/assets/plus.png"
          onClick={handleOpenAddModal}
        />
      </div>

      <div className="mt-6">
        {toppingGroups.length === 0 ? (
          <p className="text-gray-500 text-center">
            Không có nhóm topping nào.
          </p>
        ) : (
          toppingGroups.map((group) => (
            <div
              key={group._id}
              className="flex justify-between items-center bg-white p-3 rounded-md shadow-md my-2 hover:bg-gray-100"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => router.push(`menu/topping/${group._id}`)}
              >
                <p className="font-semibold">{group.name}</p>
                <p className="text-gray-500 text-sm">
                  {group.toppings?.length || 0} toppings
                </p>
              </div>

              {/* Nút cây bút */}
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={() => handleOpenEditModal(group)}
              >
                <FaPen size={16} className="text-gray-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ToppingMenuTab;
