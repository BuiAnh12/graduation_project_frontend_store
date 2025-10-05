"use client";

import React, { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LabelWithIcon from "../../components/LableWithIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAllDish, toggleSaleStatus } from "@/service/dish";
import { transformToMenuFormat } from "../../utils/dishes";
import Loading from "../../components/Loading";

const DishTab = () => {
    const router = useRouter();
    const [changePos, setChangePos] = useState(false);
    const [menu, setMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)?._id;

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                setIsLoading(true);
                const dishData = await getAllDish(storeId);
                const newData = transformToMenuFormat(dishData.data);
                setMenu(newData);
            } catch (err) {
                console.error("Failed to fetch dishes", err);
                setError("Lỗi tải danh sách món");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDishes();
    }, [storeId]);

    const toggleItemEnabled = async (id) => {
        try {
            await toggleSaleStatus({ dishId: id });
            setMenu((prevMenu) =>
                prevMenu.map((section) => ({
                    ...section,
                    items: section.items.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  saleStatus:
                                      item.saleStatus === "AVAILABLE" ? "OUT_OF_STOCK" : "AVAILABLE",
                              }
                            : item
                    ),
                }))
            );
        } catch (err) {
            console.error("Failed to toggle sale status", err);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setMenu((prevMenu) =>
            prevMenu.map((section) => {
                const oldIndex = section.items.findIndex((item) => item.id === active.id);
                const newIndex = section.items.findIndex((item) => item.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return section;

                const newItems = arrayMove(section.items, oldIndex, newIndex);
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    displayOrder: index + 1,
                }));

                return { ...section, items: updatedItems };
            })
        );
    };

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

    return (
        <div className="w-full p-4">
            <div className="flex justify-between items-center border-b pb-2 mx-4">
                <LabelWithIcon title="Thêm" iconPath="/assets/plus.png" onClick={() => router.push("menu/add")} />
                <LabelWithIcon title="Chỉnh sửa danh mục" iconPath="/assets/editing.png" onClick={() => router.push("menu/category")} />
            </div>

            {menu.map((section) => (
                <div key={section.category} className="mt-6">
                    <h3 className="font-bold text-xl mb-2">{section.category}</h3>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={section.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                            <div className="bg-gray-100 rounded-md p-2">
                                {section.items.map((item) => (
                                    <SortableItem
                                        key={item.id}
                                        item={item}
                                        router={router}
                                        changePos={changePos}
                                        toggleItemEnabled={toggleItemEnabled}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            ))}
        </div>
    );
};

const SortableItem = ({ item, changePos, router, toggleItemEnabled }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: item.id,
        disabled: !changePos,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="flex items-center justify-between bg-white p-3 rounded-md shadow-md cursor-grab my-2"
        >
            <div className="flex items-center space-x-3" onClick={() => router.push(`menu/${item.id}`)}>
                {changePos && <Image src="/assets/menu.png" alt="Drag" width={20} height={20} />}
                <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" />
                <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price}</p>
                </div>
            </div>

            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.saleStatus === "AVAILABLE"}
                    onChange={() => toggleItemEnabled(item.id)}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
            </label>
        </div>
    );
};

export default DishTab;
