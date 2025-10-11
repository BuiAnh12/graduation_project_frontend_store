"use client";
import FloatingButton from "@/components/fragments/FloatingButton";
import Header from "@/components/Header";
import {
  getStaff,
  createStaff,
  deleteStaff,
  updateStaff,
  toggleStatusStaff,
} from "@/service/staff";
import localStorageService from "@/utils/localStorageService";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaLock, FaUnlock } from "react-icons/fa";
import AddStaff from "@/components/popups/Staff/AddStaff";
import EditStaff from "@/components/popups/Staff/EditStaff";

const Page = () => {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [storeId, setStoreId] = useState(localStorageService.getStoreId());
  const [editingStaff, setEditingStaff] = useState(null);

  // ✅ pagination, search, filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterBlocked, setFilterBlocked] = useState("");

  // ✅ lấy danh sách nhân viên
  const fetchStaff = async () => {
    try {
      const res = await getStaff(storeId, {
        page,
        limit: 5,
        search: searchTerm,
        role: filterRole,
        blocked: filterBlocked,
      });

      if (res.success) {
        setStaff(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      } else {
        console.error("Lỗi khi lấy nhân viên:", res.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API nhân viên:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [storeId, page, searchTerm, filterRole, filterBlocked]);

  // ✅ Thêm nhân viên mới
  const handleAddStaff = async (data) => {
    try {
      const res = await createStaff({ ...data, storeId });

      console.log(data);
      if (res.success) {
        toast.success("Thêm nhân viên thành công!");
        setShowForm(false);
        fetchStaff(); // ✅ load lại danh sách
      } else {
        toast.error(res.message || "Không thể thêm nhân viên");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo nhân viên");
    }
  };

  const handleUpdateStaff = async (data) => {
    try {
      const res = await updateStaff(data._id, data); // data có _id do EditStaff gửi về

      if (res.success) {
        toast.success("Cập nhật nhân viên thành công!");
        setShowForm(false);
        setEditingStaff(null);
        fetchStaff(); // refresh danh sách
      } else {
        toast.error(res.message || "Không thể cập nhật nhân viên");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật nhân viên");
    }
  };
  // ✅ Xóa nhân viên
  const handleDeleteStaff = async (staffId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Nhân viên này sẽ bị xóa vĩnh viễn.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteStaff(storeId, staffId);

        if (res.success) {
          Swal.fire("Đã xóa!", "Nhân viên đã được xóa.", "success");
          fetchStaff();
        } else {
          Swal.fire("Lỗi!", res.message || "Xóa nhân viên thất bại", "error");
        }
      } catch (err) {
        Swal.fire("Lỗi!", err.message || "Xóa nhân viên thất bại", "error");
      }
    }
  };

  const handleChangeStatus = async (staffId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Tài khoản nhân viên này sẽ thay đổi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await toggleStatusStaff(staffId);

        if (res.success) {
          Swal.fire(
            "Thành công!",
            "Trạng thái tài khoản đã thay đổi.",
            "success"
          );
          fetchStaff();
        } else {
          Swal.fire(
            "Lỗi!",
            res.message || "Thay đổi trạng thái nhân viên thất bại",
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
      <Header title="Quản lý nhân viên" goBack={true} />
      <FloatingButton onClick={() => setShowForm(true)} />{" "}
      {/* ✅ bật popup thêm nhân viên */}
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
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-md w-full sm:w-1/4 mt-2 sm:mt-0"
          >
            <option value="">Tất cả vai trò</option>
            <option value="STAFF">Nhân viên</option>
            <option value="MANAGER">Quản lý</option>
          </select>

          <select
            value={filterBlocked}
            onChange={(e) => {
              setFilterBlocked(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-md w-full sm:w-1/4 mt-2 sm:mt-0"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="false">Đang hoạt động</option>
            <option value="true">Bị khóa</option>
          </select>
        </div>

        {/* Danh sách nhân viên */}
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-md sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Điện thoại
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Giới tính
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Chức vụ
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-800">
                  {staff.map((st) => {
                    const isBlocked = st.accountId?.blocked;

                    return (
                      <tr
                        key={st._id}
                        className={`${
                          isBlocked ? "opacity-50 bg-gray-50" : ""
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {st.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {st.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {st.phonenumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {st.gender === "male"
                            ? "Nam"
                            : st.gender === "female"
                            ? "Nữ"
                            : "Khác"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {st.role[0] === "STAFF"
                            ? "Nhân viên"
                            : st.role[0] === "MANAGER"
                            ? "Quản lý"
                            : st.role[0] === "STORE_OWNER"
                            ? "Chủ cửa hàng"
                            : "Không xác định"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-4 items-center">
                          {/* Sửa nhân viên */}
                          <button
                            onClick={() => {
                              setEditingStaff(st);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>

                          {/* Khóa / Mở khóa */}
                          <button
                            onClick={() => handleChangeStatus(st._id)}
                            className={`${
                              isBlocked
                                ? "text-yellow-600 hover:text-yellow-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {isBlocked ? <FaLock /> : <FaUnlock />}
                          </button>

                          {/* Xóa nhân viên */}
                          <button
                            onClick={() => handleDeleteStaff(st._id)}
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
      {/* ✅ Popup thêm nhân viên */}
      {showForm && (
        <AddStaff
          onClose={() => setShowForm(false)} // ✅ đúng biến state
          onSubmit={handleAddStaff}
        />
      )}
      {showForm && editingStaff && (
        <EditStaff
          staffData={editingStaff}
          onClose={() => {
            setShowForm(false);
            setEditingStaff(null);
          }}
          onSubmit={handleUpdateStaff}
        />
      )}
    </>
  );
};

export default Page;
