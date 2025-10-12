import React, { useEffect, useState } from "react";

const EditVoucher = ({ voucherData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    _id: "",
    code: "",
    description: "",
    discountType: "",
    discountValue: "",
    maxDiscount: "",
    minOrderAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    userLimit: "",
  });

  useEffect(() => {
    if (voucherData) {
      setFormData({
        _id: voucherData._id,
        code: voucherData.code || "",
        description: voucherData.description || "",
        discountType: voucherData.discountType || "",
        discountValue: voucherData.discountValue || "",
        maxDiscount: voucherData.maxDiscount || "",
        minOrderAmount: voucherData.minOrderAmount || "",
        startDate: voucherData.startDate
          ? voucherData.startDate.slice(0, 16)
          : "",
        endDate: voucherData.endDate ? voucherData.endDate.slice(0, 16) : "",
        usageLimit: voucherData.usageLimit || "",
        userLimit: voucherData.userLimit || "",
      });
    }
  }, [voucherData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = e.target.type === "number" ? Math.max(0, Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      alert("Giá trị phần trăm không được vượt quá 100%");
      return;
    }

    onSubmit({
      ...formData,
      discountValue: Number(formData.discountValue),
      maxDiscount: Number(formData.maxDiscount),
      minOrderAmount: Number(formData.minOrderAmount),
      usageLimit: Number(formData.usageLimit),
      userLimit: Number(formData.userLimit),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-2xl">
        <h3 className="text-xl font-semibold mb-5 text-center">
          Cập nhật voucher
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* CODE + DESCRIPTION */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Mã code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập code"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập mô tả"
                required
              />
            </div>
          </div>

          {/* DISCOUNT TYPE + VALUE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Loại giảm giá
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              >
                <option value="">-- Chọn loại --</option>
                <option value="PERCENTAGE">PERCENTAGE (%)</option>
                <option value="FIXED">FIXED (VNĐ)</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Giá trị giảm
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                disabled={!formData.discountType}
                min={formData.discountType === "PERCENTAGE" ? 1 : 0}
                max={formData.discountType === "PERCENTAGE" ? 100 : undefined}
                placeholder={
                  formData.discountType === "PERCENTAGE"
                    ? "Nhập % (tối đa 100)"
                    : formData.discountType === "FIXED"
                    ? "Nhập số tiền giảm"
                    : "Chọn loại giảm giá trước"
                }
                className={`border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none ${
                  !formData.discountType ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
              />
            </div>
          </div>

          {/* MAX DISCOUNT + MIN ORDER */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Giảm tối đa
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập giảm tối đa (VNĐ)"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Giá trị đơn tối thiểu
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Nhập giá trị đơn tối thiểu"
              />
            </div>
          </div>

          {/* START + END DATE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Ngày kết thúc
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          {/* LIMITS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Số lượng</label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="1"
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Tối đa cho mỗi người dùng
              </label>
              <input
                type="number"
                name="userLimit"
                value={formData.userLimit}
                onChange={handleChange}
                min="1"
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>

          {/* BUTTONS */}
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
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucher;
