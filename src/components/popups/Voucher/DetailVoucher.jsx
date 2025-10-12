import React, { useEffect, useState } from "react";

const DetailVoucher = ({ voucherData, onClose }) => {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-2xl">
        <h3 className="text-xl font-semibold mb-5 text-center">
          Chi tiết voucher
        </h3>

        <form className="flex flex-col gap-4">
          {/* CODE + DESCRIPTION */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Mã code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly
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
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                disabled
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
                disabled={!formData.discountType}
                min={formData.discountType === "PERCENTAGE" ? 1 : 0}
                max={formData.discountType === "PERCENTAGE" ? 100 : undefined}
                readOnly
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
                readOnly
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
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
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly
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
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                readOnly
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
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                readOnly
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
                min="1"
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                required
                readOnly
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
                min="1"
                className="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                readOnly
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
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailVoucher;
