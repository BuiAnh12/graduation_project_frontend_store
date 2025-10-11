import React, { useEffect, useState } from "react";
import { StoreRoleOptions } from "@/constants/roles";

const EditStaff = ({ staffData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    gender: "",
    role: "",
  });

  useEffect(() => {
    if (staffData) {
      setFormData({
        _id: staffData._id,
        name: staffData.name || "",
        email: staffData.email || "",
        phonenumber: staffData.phonenumber || "",
        gender: staffData.gender || "",
        role: staffData.role ? staffData.role[0] : "",
      });
    }
  }, [staffData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-2xl">
        <h3 className="text-xl font-semibold mb-5 text-center">
          Cập nhật thông tin
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Nhập tên nhân viên"
              required
            />
          </div>

          {/* Email + Số điện thoại */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          {/* Giới tính + Vai trò */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Chức vụ</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              >
                <option value="">-- Chọn chức vụ --</option>
                {StoreRoleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
