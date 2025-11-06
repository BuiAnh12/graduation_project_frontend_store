"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import generateOrderNumber from "../../utils/generateOrderNumber";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import {
  deliveryByStore,
  finishedOrder,
  getAllOrders,
  resendNotificationToShipper,
  updateOrder,
} from "@/service/order";
import { ClipLoader } from "react-spinners";
import localStorageService from "@/utils/localStorageService"; // <-- make sure this path is correct

const statusMap = {
  "Tất cả": "all",
  "Đang chuẩn bị": "preparing",
  "Đã thông báo tài xế": "finished",
};

const reverseStatusMap = {
  all: "Tất cả",
  preparing: "Đang chuẩn bị",
  finished: "Đã thông báo tài xế",
};

const OrderCard = ({ order, orderIndex, refetch }) => {
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    if (order.items) {
      const total = order.items.reduce(
        (acc, item) => {
          const toppingsPrice =
            (Array.isArray(item.toppings)
              ? item.toppings.reduce(
                  (sum, topping) => sum + (topping.price || 0),
                  0
                )
              : 0) * item.quantity;

          acc.quantity += item.quantity;
          acc.price += (item.dish?.price || 0) * item.quantity + toppingsPrice;
          return acc;
        },
        { price: 0, quantity: 0 }
      );

      setCartQuantity(total.quantity);
    }
  }, [order.items]);

  const handleUpdateOrderToFinish = async () => {
    try {
      await finishedOrder(order._id);
      refetch();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleResendNotification = async () => {
    const result = await Swal.fire({
      title: "Gửi lại thông báo",
      text: "Xác nhận gửi lại thông báo để tìm kiếm tài xế?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xác nhận!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await resendNotificationToShipper(order._id);
        refetch();

        Swal.fire({
          icon: "success",
          title: "Đã xác nhận!",
          text: "Đơn hàng của bạn đang được thông báo cho các shipper khả dụng.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Update failed:", err);
        Swal.fire({
          icon: "error",
          title: "Thất bại!",
          text: "Không thể gửi lại thông bao.",
        });
      }
    }
  };

  const handleUpdateOrderToStoreDelivering = async () => {
    const result = await Swal.fire({
      title: "Xác nhận giao hàng",
      text: "Bạn có chắc chắn muốn tự giao đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, xác nhận!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        await deliveryByStore(order._id);
        refetch();

        Swal.fire({
          icon: "success",
          title: "Đã xác nhận!",
          text: "Đơn hàng đã được cập nhật thành 'Tự giao hàng'.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Update failed:", err);
        Swal.fire({
          icon: "error",
          title: "Thất bại!",
          text: "Không thể cập nhật trạng thái đơn hàng.",
        });
      }
    }
  };
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white mb-4">
      <Link href={`orders/${order._id}`} passHref>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-[#fc6011] text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-sm">
              {orderIndex}
            </div>
            <div className="ml-2 text-sm text-gray-700">
              <span className="font-bold text-[#fc6011] text-lg">
                #{generateOrderNumber(order._id)}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800">
            {order.users?.name ?? "Unknown"}
          </p>
          <div className="flex justify-between">
            <p className="text-sm text-gray-600">Đang tìm tài xế</p>
            <div className="text-sm text-gray-600">{cartQuantity} món</div>
          </div>
        </div>
      </Link>

      {order.status === "preparing" ? (
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 text-white bg-[#fc6011] rounded-sm hover:bg-[#e9550f] cursor-pointer"
            onClick={handleUpdateOrderToFinish}
          >
            Thông báo tài xế
          </button>
        </div>
      ) : order.status === "finished" ? (
        <div className="flex md:flex-row flex-col justify-between gap-2 mt-2">
          <button
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600 cursor-pointer"
            onClick={handleUpdateOrderToStoreDelivering}
          >
            Tự giao hàng
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-white bg-gray-400 rounded-sm hover:bg-gray-500 cursor-pointer"
            onClick={handleResendNotification}
          >
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Đang tìm tài xế ...
          </button>
        </div>
      ) : (
        <p>Đơn hàng đang được vận chuyển</p>
      )}
    </div>
  );
};

const VerifyOrderTab = ({ storeId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dropdownOptions = ["Tất cả", "Đang chuẩn bị", "Đã thông báo tài xế"];
  const ordersPerPage = 10;

  const [selectedStatus, setSelectedStatus] = useState(() => {
    const fromStorage = localStorageService.getActiveFilter();
    const fromURL = searchParams.get("status");
    return fromStorage || fromURL || "all";
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(pageParam) ? 1 : pageParam;
  });

  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    const urlPage = searchParams.get("page");

    if (!urlStatus || !urlPage) {
      const statusToSet = urlStatus || "all";
      const pageToSet = urlPage || "1";

      const params = new URLSearchParams(searchParams.toString());
      params.set("status", statusToSet);
      params.set("page", pageToSet);

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const statuses =
        selectedStatus === "all" ? ["preparing", "finished"] : [selectedStatus];
      const res = await getAllOrders({
        storeId,
        status: statuses,
        limit: ordersPerPage,
        page: currentPage,
      });
      console.log("Res vd: ", res);

      // API returns an object where the actual array is at res.data.data
      // (because getAllOrders returns res.data from axios). Be defensive
      // and support a couple of possible shapes.
      const payload = res?.data ?? res; // payload is either the inner data object or the array
      const ordersArray = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];

      setOrders(
        ordersArray.toSorted(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        ) || []
      );

      setTotalPages(payload?.totalPages ?? payload?.totalPages === 0 ? 0 : 1);
    } catch (err) {
      console.error(err);
      setError("Không thể tải đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }, [storeId, selectedStatus, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateQuery = (newStatus, newPage = 1) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", newStatus);
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleDropdownChange = (value) => {
    const statusCode = statusMap[value];
    if (!statusCode) return;
    setSelectedStatus(statusCode);
    localStorageService.setActiveFilter(statusCode);
    updateQuery(statusCode, 1);
    setCurrentPage(1);
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    updateQuery(selectedStatus, newPage);
    setCurrentPage(newPage);
  };

  const selectedStatusLabel = reverseStatusMap[selectedStatus] || "Tất cả";

  if (error) {
    return <p className="text-center py-5 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full px-4 py-2">
      <Dropdown
        options={dropdownOptions}
        onChange={handleDropdownChange}
        value={selectedStatusLabel}
      />
      {isLoading ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <ClipLoader
            visible={true}
            height="80"
            width="80"
            color="#fc6011"
            radius="9"
          />
        </div>
      ) : (
        <>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Không có đơn hàng nào.
            </p>
          ) : (
            orders.map((order, index) => (
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
                  className="w-5 h-5"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
                  className="w-5 h-5"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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
              containerClassName={"pagination flex space-x-2"}
              activeClassName={"bg-orange-500 text-white"}
              pageClassName={"border px-3 py-1 rounded-lg cursor-pointer"}
              previousClassName={"border px-3 py-1 rounded-lg cursor-pointer"}
              nextClassName={"border px-3 py-1 rounded-lg cursor-pointer"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyOrderTab;
