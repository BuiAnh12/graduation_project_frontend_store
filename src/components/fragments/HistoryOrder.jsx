import { useRouter } from "next/navigation";
const HistoryOrder = ({ order }) => {
    const router = useRouter();
    return (
        <div className="w-full px-4 py-2 mt-20 mb-20">
            <div className="w-full p-4 bg-gray-50">
                {/* Customer Notes */}
                <div className="p-2 bg-yellow-100 text-yellow-800 text-sm rounded-md mb-4">
                    Khách ghi chú:{" "}
                    <span className="font-semibold">
                        {order?.notes || "Không có ghi chú"}
                    </span>
                </div>

                {/* Customer Info */}
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"></div>
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
                    </div>
                    <button className="py-1 px-3 bg-[#fc6011] text-white rounded-md hover:bg-[#e9550f]">
                        Gọi
                    </button>
                </div>

                {/* Driver Info */}
                <div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"></div>
                    <div className="ml-3">
                        <h3 className="text-gray-800 font-medium">
                            {order?.driver || "Chưa có tài xế"}
                        </h3>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <ul className="mb-4 text-sm text-gray-700">
                        {order?.items?.map((item, index) => (
                            <li
                                key={index}
                                className="flex justify-between py-2"
                            >
                                <span>
                                    {item?.quantity} x {item?.dish.name}
                                </span>
                                <span>
                                    {item?.dish.price?.toLocaleString() || 0}₫
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
                            <span className="text-gray-700">Phí giao hàng</span>
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
                        <a href="/" className="text-blue-500 underline">
                            {order?._id || "N/A"}
                        </a>
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
                            )}{" "}
                            {new Date(order?.createdAt).toLocaleDateString(
                                "vi-VN"
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Khoảng cách</span>
                        <span className="text-gray-800">
                            {order?.metadata?.distance || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            Thời gian lấy hàng dự kiến
                        </span>
                        <span className="text-gray-800">
                            {order?.metadata?.estimatedPickup || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Order Status */}
                <div className="bg-white p-4 rounded-lg shadow-md mt-2">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                            Trạng thái đơn hàng
                        </span>
                        <span className="text-gray-800">
                            {order?.status || "Chưa cập nhật"}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            Phương thức thanh toán
                        </span>
                        <span className="text-gray-800">
                            {order?.paymentMethod || "Không xác định"}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex w-full space-x-4 justify-between p-1 mt-2">
                    <button className="py-2 px-4 bg-gray-200 text-md text-gray-700 rounded-md hover:bg-gray-300 w-full">
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
    );
};

export default HistoryOrder;
