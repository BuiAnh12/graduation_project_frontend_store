import { useRouter } from "next/navigation";
import { updateOrder } from "@/service/order";
import Modal from "@/components/Modal";
import { useState } from "react";

const ConfirmedOrder = ({ order }) => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const handleUpdateOrderToCancel = async () => {
        try {
            await updateOrder({
                orderId: order._id,
                updatedData: { ...order, status: "cancelled" },
            });
            setShowModal(false);
            router.back()
        } catch (err) {
            console.error("Update failed:", err);
        }
    };
    return (
        <>
            <div className="w-full px-4 py-2 mt-20">
                <div className="w-full p-4 bg-gray-50">
                    <div className="p-2 bg-yellow-100 text-yellow-800 text-sm rounded-md mb-4">
                        Khách ghi chú:{" "}
                        <span className="font-semibold">Không có ghi chú</span>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
                        <div className="flex items-center">
                            {/* <img
                            src={order?.user?.avatar?.url || "/default-avatar.png"}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        /> */}
                            <div className="ml-3">
                                <h3 className="text-gray-800 font-medium">
                                    {order?.shipInfo?.contactName ||
                                        "Không xác định"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {order?.shipInfo?.contactPhonenumber ||
                                        "Không có số điện thoại"}
                                </p>
                            </div>
                            <button className="py-1 px-3 bg-[#fc6011] text-white rounded-md hover:bg-[#e9550f]">
                                Gọi
                            </button>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <ul className="mb-4 text-sm text-gray-700">
                            {order?.items?.map((item) => (
                                <li
                                    key={item._id}
                                    className="flex justify-between py-2"
                                >
                                    <span>
                                        {item.quantity} x {item.dish.name}
                                    </span>
                                    <span>
                                        {item.dish.price.toLocaleString()}₫
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Order Summary */}
                        <div className="text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Giảm giá</span>
                                <span className="text-gray-800 font-medium">
                                    {order?.totalDiscount}₫
                                </span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">
                                    Phí giao hàng
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {order?.shippingFee}₫
                                </span>
                            </div>
                            {/* <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Phí đóng gói</span>
                            <span className="text-gray-800 font-medium">0₫</span>

                        </div> */}
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-bold">
                                    Tổng tiền món (giá gốc)
                                </span>
                                <span className="text-gray-800 font-medium">
                                    {order?.subtotalPrice}₫
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-md font-bold">
                                    Tổng tiền quán nhận
                                </span>
                                <span className="text-md font-bold text-[#fc6011]">
                                    {order?.finalTotal}₫
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Metadata */}

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Mã đơn hàng</span>
                            <span>{order?._id}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">
                                Thời gian đặt hàng
                            </span>
                            <span className="text-gray-800">
                                {new Date(order?.createdAt).toLocaleTimeString(
                                    "vi-VN",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex w-full space-x-4 justify-between my-4 p-1">
                        <button
                            className="py-2 px-4 bg-gray-200 text-md text-gray-700 rounded-md hover:bg-gray-300 w-full"
                            onClick={() => setShowModal(true)}
                        >
                            Hủy
                        </button>
                        <button
                            className="py-2 px-4 bg-[#fc6011] text-md text-white rounded-md hover:bg-[#e9550f] w-full"
                            onClick={() =>
                                router.push(`/orders/${order._id}/update`)
                            }
                        >
                            Sửa
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleUpdateOrderToCancel}
                title="Xác nhận hủy đơn hàng"
                confirmTitle="Đồng ý"
                closeTitle="Không"
            >
                Bạn có chắc chắn muốn <strong>hủy đơn hàng</strong> này không?
            </Modal>
        </>
    );
};

export default ConfirmedOrder;
