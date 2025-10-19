"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrders } from "@/service/order";
import ReactPaginate from "react-paginate";
import generateOrderNumber from "../../utils/generateOrderNumber";
import { ThreeDots } from "react-loader-spinner";

const paymentTypes = {
  cash: "Thanh toán khi nhận hàng",
  vnpay: "Thanh toán qua VNPay",
};

const statusTypes = {
  pending: "Đang chờ",
  preparing: "Đang chuẩn bị",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
  taken: "Đã lấy",
  delivering: "Đang giao",
  done: "Đã xong",
};

const formatVND = (n) =>
  (n ?? 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const OrderCard = ({ order, orderIndex }) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (order.items) {
      const { totalPrice, totalQuantity } = order.items.reduce(
        (acc, item) => {
          const dishPrice = (item.dish?.price || 0) * item.quantity;
          const toppingsPrice =
            (Array.isArray(item.toppings)
              ? item.toppings.reduce(
                  (sum, topping) => sum + (topping.price || 0),
                  0
                )
              : 0) * item.quantity;

          acc.totalPrice += dishPrice + toppingsPrice;
          acc.totalQuantity += item.quantity;

          return acc;
        },
        { totalPrice: 0, totalQuantity: 0 }
      );

      setCartPrice(totalPrice);
      setCartQuantity(totalQuantity);
    }
  }, [order.items]);

  return (
    <div
      className="border rounded-lg shadow-md p-4 bg-white mb-4"
      onClick={() => router.push(`orders/${order._id}`)}
      data-testid="verify-order-row"
      data-order-id={order._id}
      data-status={order.status}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="text-sm text-gray-700">
            <p className="text-gray-700 text-md font-bold">
              {order.user?.name || "Unknown User"}
            </p>
            <p>
              <span data-testid="total-qty">{cartQuantity}</span> Món /
              <span data-testid="total-price">
                {formatVND(order.finalTotal)}
              </span>
            </p>
            <p className="text-sm text-gray-400 text-light">
              {generateOrderNumber(order._id)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <p className="text-sm font-medium text-gray-400">Lấy đơn</p>
          {order.createdAt
            ? new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "--:--"}
        </div>
        <div className="col-span-3">
          <p className="text-sm font-medium text-gray-400">Món</p>
          <p className="text-sm font-medium text-[#fc6011]">{cartQuantity}</p>
        </div>
        <div className="col-span-6">
          <p className="text-sm font-medium text-gray-400">Trạng thái</p>
          <p className="text-sm text-gray-800 font-senibold">
            {statusTypes[order.status] ?? "n/a"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="flex justify-start items-center">
          <div className="text-sm text-gray-400 font-bold">
            {paymentTypes[order.paymentMethod] || "Thanh toán khi nhận hàng"}
          </div>
        </div>
        <div className="flex justify-end items-center">
          <div className="text-sm text-[#fc6011] font-bold">
            {formatVND(order.finalTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryOrder = ({ storeId }) => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders({
        storeId,
        status: [
          "delivered",
          "cancelled",
          "completed",
          "taken",
          "delivering",
          "done",
        ],
        limit: ordersPerPage,
        page: currentPage,
      });

      setOrders(res?.data?.data ?? []);
      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchOrders();
  }, [storeId, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#fc6011"
          radius="9"
        />
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="w-full px-4 py-2">
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          Không có đơn hàng nào.
        </p>
      ) : (
        sortedOrders.map((order, index) => (
          <div key={order._id} className="bg-transparency flex flex-col">
            <OrderCard
              order={order}
              orderIndex={(index + (currentPage - 1) * ordersPerPage + 1)
                .toString()
                .padStart(2, "0")}
            />
          </div>
        ))
      )}
      <div className="flex items-center justify-center w-full h-max mt-10 mb-20">
        <ReactPaginate
          previousLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          }
          nextLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          }
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          forcePage={currentPage - 1}
          containerClassName="pagination flex space-x-2"
          activeClassName="bg-orange-500 text-white"
          pageClassName="border px-3 py-1 rounded-lg cursor-pointer"
          previousClassName="border px-3 py-1 rounded-lg cursor-pointer"
          nextClassName="border px-3 py-1 rounded-lg cursor-pointer"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default HistoryOrder;
