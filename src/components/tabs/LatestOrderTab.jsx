"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllOrders, updateOrder } from "@/service/order";

import ReactPaginate from "react-paginate";
import { ClipLoader } from "react-spinners";

const OrderCard = ({ order, orderIndex, refetch }) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);

  const handleUpdateOrder = async () => {
    if (!order) return;
    try {
      console.log(order._id);
      const updatedOrder = { ...order, status: "confirmed" };
      const orderId = order._id;
      await updateOrder({ orderId, updatedData: updatedOrder });
      refetch();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const router = useRouter();

  const calculateCartPrice = () => {
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
  };

  useEffect(() => {
    calculateCartPrice();
  }, []);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-[#FCF5F4] mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="bg-[#fc6011] p-2 text-white font-bold text-lg w-auto h-10 flex items-center justify-center rounded-md">
            {orderIndex}
          </div>
          <div className="ml-2 text-sm text-gray-700">
            <p className="font-medium text-gray-900">{order.users?.name}</p>
            <p>
              {cartQuantity} Món /{order.finalTotal}đ
            </p>
          </div>
        </div>
      </div>

      <ul className="text-sm text-gray-700 mb-3">
        {order.items.map((item, idx) => {
          const toppingCount = item.toppings?.length || 0;
          return (
            <li key={idx}>
              {item.quantity} x {item.dishName}{" "}
              {toppingCount > 0 ? `(${toppingCount} Topping)` : ""}
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between">
        <p className="font-thin text-sm text-gray-400 flex-shrink-0"></p>
        <div className="flex space-x-4">
          <button
            className="py-1 px-2 bg-gray-200 text-sm text-gray-700 rounded-md hover:bg-gray-300"
            onClick={() => router.push(`orders/${order._id}`)}
          >
            Xem thêm
          </button>
          <button
            className="py-1 px-2 bg-[#fc6011] text-sm text-white rounded-md hover:bg-[#e9550f]"
            onClick={handleUpdateOrder}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

const LatestOrder = ({ storeId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders({
        storeId,
        status: "pending",
        limit: ordersPerPage,
        page: currentPage,
      });

      console.log("RES: ", res);

      setOrders(res.data.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchOrders();
  }, [storeId, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <ClipLoader
          color="#fc6011"
          loading={true}
          size={80} // 👈 thay cho height/width
        />
      </div>
    );
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

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
          <OrderCard
            key={order._id}
            order={order}
            orderIndex={(index + (currentPage - 1) * ordersPerPage + 1)
              .toString()
              .padStart(2, "0")}
            refetch={fetchOrders}
          />
        ))
      )}
      <div className="flex items-center justify-center w-full h-max mt-10 mb-20">
        <ReactPaginate
          previousLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
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
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          }
          breakLabel="..."
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
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

export default LatestOrder;
