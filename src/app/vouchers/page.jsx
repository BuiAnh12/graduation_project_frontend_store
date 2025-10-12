"use client";
import FloatingButton from "@/components/fragments/FloatingButton";
import Header from "@/components/Header";

import {
  createVoucher,
  getVouchersByStore,
  updateVoucher,
  deleteVoucher,
  toggleVoucherActiveStatus,
} from "@/service/voucher";
import localStorageService from "@/utils/localStorageService";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaLock, FaUnlock } from "react-icons/fa";
import AddVoucher from "@/components/popups/Voucher/AddVoucher";
import EditVoucher from "@/components/popups/Voucher/EditVoucher";
import DetailVoucher from "@/components/popups/Voucher/DetailVoucher";
const Page = () => {
  const [vouchers, setVouchers] = useState([]);
  const [storeId] = useState(localStorageService.getStoreId());
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [detailVoucher, setDetailVoucher] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // ✅ pagination, search, filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStackable, setFilterStackable] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ lấy danh sách voucher
  const fetchVouchers = async () => {
    try {
      const res = await getVouchersByStore(storeId, {
        page,
        limit: 5,
        search: searchTerm,
        type: filterType,
        stackable: filterStackable,
        active: filterActive,
      });

      if (res.success) {
        setVouchers(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      } else {
        console.error("Lỗi khi lấy voucher:", res.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API voucher:", error);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchVouchers();
    }
  }, [storeId, page, searchTerm, filterType, filterStackable, filterActive]);

  const handleAddVoucher = async (data) => {
    try {
      const res = await createVoucher(storeId, data);

      console.log(data);
      if (res.success) {
        toast.success("Thêm voucher thành công!");
        setShowForm(false);
        fetchVouchers();
      } else {
        toast.error(res.message || "Không thể thêm voucher");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo voucher");
    }
  };

  const handleUpdateVoucher = async (data) => {
    try {
      const res = await updateVoucher(data._id, data);

      if (res.success) {
        toast.success("Cập nhật voucher thành công!");
        setShowForm(false);
        setEditingVoucher(null);
        fetchVouchers();
      } else {
        toast.error(res.message || "Không thể cập nhật voucher");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật voucher");
    }
  };
  const handleDeleteVoucher = async (voucherId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Voucher này sẽ bị xóa vĩnh viễn.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteVoucher(voucherId);

        if (res.success) {
          Swal.fire("Đã xóa!", "Voucher đã được xóa.", "success");
          fetchVouchers();
        } else {
          Swal.fire("Lỗi!", res.message || "Xóa voucher thất bại", "error");
        }
      } catch (err) {
        Swal.fire("Lỗi!", err.message || "Xóa voucher thất bại", "error");
      }
    }
  };

  const handleChangeStatus = async (voucherId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Voucher này sẽ thay đổi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await toggleVoucherActiveStatus(storeId, voucherId);

        if (res.success) {
          Swal.fire(
            "Thành công!",
            "Trạng thái voucher đã thay đổi.",
            "success"
          );
          fetchVouchers();
        } else {
          Swal.fire(
            "Lỗi!",
            res.message || "Thay đổi trạng thái voucher thất bại",
            "error"
          );
        }
      } catch (err) {
        Swal.fire(
          "Lỗi!",
          err.message || "Thay đổi trạng thái thất bại",
          "error"
        );
      }
    }
  };

  return (
    <>
      <Header title="Quản lý voucher" goBack={true} />
      <FloatingButton onClick={() => setShowForm(true)} />{" "}
      <div className="pt-[70px] pb-[10px] bg-gray-100">
        {/* Thanh tìm kiếm + lọc */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-white">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-md w-full sm:w-1/3"
          />

          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-md w-full sm:w-1/4 mt-2 sm:mt-0"
          >
            <option value="">Tất cả các loại</option>
            <option value="PERCENTAGE">Phần trăm</option>
            <option value="FIXED">Giảm giá</option>
          </select>

          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-md w-full sm:w-1/4 mt-2 sm:mt-0"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Bị khóa</option>
          </select>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-md sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Mã code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Loại giảm giá
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Giới hạn
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Đã dùng
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-800">
                  {vouchers.map((voucher) => {
                    const isInactive = !voucher.isActive;
                    const isExpired =
                      voucher.endDate && new Date(voucher.endDate) < new Date();
                    const isDimmed = isInactive || isExpired; // 🔹 điều kiện làm mờ

                    return (
                      <tr
                        key={voucher._id}
                        className={`${
                          isDimmed ? "opacity-50 bg-gray-50" : ""
                        } hover:bg-gray-100 transition`}
                      >
                        <td
                          className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-500"
                          onClick={() => {
                            setDetailVoucher(voucher);
                            setShowForm(true);
                          }}
                        >
                          {voucher.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voucher.discountType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voucher.discountValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voucher.usageLimit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voucher.usedCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-4 items-center">
                          <button
                            onClick={() => {
                              setEditingVoucher(voucher);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>

                          {/* Khóa / Mở khóa */}
                          <button
                            onClick={() => handleChangeStatus(voucher._id)}
                            className={`${
                              isInactive
                                ? "text-yellow-600 hover:text-yellow-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {isInactive ? <FaLock /> : <FaUnlock />}
                          </button>

                          <button
                            onClick={() => handleDeleteVoucher(voucher._id)}
                            className="text-red-600 hover:text-yellow-800"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Phân trang */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
      {showForm && (
        <AddVoucher
          onClose={() => setShowForm(false)}
          onSubmit={handleAddVoucher}
        />
      )}
      {showForm && editingVoucher && (
        <EditVoucher
          voucherData={editingVoucher}
          onClose={() => {
            setShowForm(false);
            setEditingVoucher(null);
          }}
          onSubmit={handleUpdateVoucher}
        />
      )}
      {showForm && detailVoucher && (
        <DetailVoucher
          voucherData={detailVoucher}
          onClose={() => {
            setShowForm(false);
            setDetailVoucher(null);
          }}
        />
      )}
    </>
  );
};

export default Page;
