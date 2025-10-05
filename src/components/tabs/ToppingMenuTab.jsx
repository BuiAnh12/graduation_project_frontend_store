"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LabelWithIcon from "@/components/LableWithIcon";
import Modal from "../Modal";
import { getAllTopping, addToppingGroupOnly } from "@/service/topping";
import Loading from "@/components/Loading";

const ToppingMenuTab = () => {
    const router = useRouter();
    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)?._id;

    const [toppingGroups, setToppingGroups] = useState([]);
    const [newGroups, setNewGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    // Fetch topping groups
    useEffect(() => {
        const fetchToppings = async () => {
            try {
                setIsLoading(true);
                const response = await getAllTopping({ storeId, limit: 10, page: 1 });
                setToppingGroups(response?.data || []);
            } catch (err) {
                console.error("Error fetching toppings:", err);
                setError("Lỗi khi tải topping");
            } finally {
                setIsLoading(false);
            }
        };

        fetchToppings();
    }, [storeId]);

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) return;

        try {
            const newGroup = await addToppingGroupOnly({ storeId, name: newGroupName });
            setNewGroups((prev) => [...prev, newGroup]);
            setNewGroupName("");
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to add topping group:", err);
        }
    };

    const allGroups = [...toppingGroups, ...newGroups];

    if (isLoading) return <Loading />;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="w-full p-4">
            {/* Modal for adding new topping group */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleAddGroup}
                title="Thêm Nhóm Topping"
                confirmTitle="Lưu"
                closeTitle="Hủy"
            >
                <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nhập tên nhóm topping"
                    className="w-full p-2 border rounded-md"
                    required
                />
            </Modal>

            {/* Add new topping group button */}
            <div className="flex justify-between items-center border-b pb-2 mx-3">
                <LabelWithIcon title="Thêm nhóm" iconPath="/assets/plus.png" onClick={() => setIsModalOpen(true)} />
            </div>

            {/* Topping groups list */}
            <div className="mt-6">
                {allGroups.length === 0 ? (
                    <p className="text-gray-500 text-center">Không có nhóm topping nào.</p>
                ) : (
                    allGroups.map((group) => (
                        <div
                            key={group._id}
                            className="flex justify-between items-center bg-white p-3 rounded-md shadow-md cursor-pointer my-2 hover:bg-gray-100"
                            onClick={() => router.push(`menu/topping/${group._id}`)}
                        >
                            <p className="font-semibold">{group.name}</p>
                            <p className="text-gray-500">{group.toppings?.length || 0} toppings</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ToppingMenuTab;
