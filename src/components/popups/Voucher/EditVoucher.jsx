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

  // Khởi tạo/cập nhật formData khi voucherData thay đổi
  useEffect(() => {
    if (voucherData) {
      setFormData({
        _id: voucherData._id,
        code: voucherData.code || "",
        description: voucherData.description || "",
        discountType: voucherData.discountType || "",
        // Giữ nguyên giá trị cũ để hiển thị trên input
        discountValue: voucherData.discountValue || "",
        maxDiscount: voucherData.maxDiscount || "",
        minOrderAmount: voucherData.minOrderAmount || "",
        // Format lại ISO date thành datetime-local format
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
    let val = value;

    // Logic: Xử lý input number (cho phép rỗng và không âm)
    if (e.target.type === "number") {
      const numValue = Number(value);
      // Giữ val là chuỗi rỗng nếu input rỗng, hoặc là giá trị không âm
      val = value === "" ? "" : Math.max(0, numValue);
    }

    // Xử lý khi thay đổi discountType
    if (name === "discountType") {
      setFormData((prev) => ({
        ...prev,
        [name]: val,
        // Nếu chuyển sang FIXED, xóa giá trị maxDiscount khỏi state
        maxDiscount: val === "FIXED" ? "" : prev.maxDiscount,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = formData;

    // --- BẮT ĐẦU VALIDATION ---
    const requiredFields = {
      code: "Mã code",
      description: "Mô tả",
      discountType: "Loại giảm giá",
      discountValue: "Giá trị giảm",
      startDate: "Ngày bắt đầu",
      endDate: "Ngày kết thúc",
      usageLimit: "Số lượng",
      userLimit: "Tối đa cho mỗi người dùng",
    };

    // 1. Kiểm tra các trường bắt buộc chung
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!data[key] || (typeof data[key] === 'string' && data[key].trim() === "")) {
        // Lưu ý: Thay alert() bằng custom modal trong môi trường sản phẩm
        alert(`Vui lòng nhập ${label}.`);
        return;
      }
    }

    // 2. Validate Giá trị giảm (Discount Value)
    const discountValueNum = Number(data.discountValue);
    if (data.discountType === "PERCENTAGE") {
        if (discountValueNum > 100 || discountValueNum <= 0) {
            alert("Giá trị phần trăm phải nằm trong khoảng 1% đến 100%.");
            return;
        }
    } else if (data.discountType === "FIXED") {
        if (discountValueNum < 0) {
            alert("Giá trị giảm (VNĐ) không được âm.");
            return;
        }
    }

    // 3. Validate Giảm tối đa (Max Discount - Bắt buộc cho PERCENTAGE)
    if (data.discountType === "PERCENTAGE") {
      const maxDiscountNum = Number(data.maxDiscount);
      if (isNaN(maxDiscountNum) || maxDiscountNum < 0 || String(data.maxDiscount).trim() === "") {
        alert("Vui lòng nhập Giảm tối đa (VNĐ) và phải là số không âm.");
        return;
      }
    }
    
    // 4. Validate Phạm vi Ngày
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) {
        alert("Ngày kết thúc phải lớn hơn Ngày bắt đầu.");
        return;
    }

    // 5. Validate Giới hạn (đã có min="1" trên UI, kiểm tra lại để chắc chắn)
    if (Number(data.usageLimit) < 1 || Number(data.userLimit) < 1) {
        alert("Số lượng và giới hạn người dùng phải lớn hơn hoặc bằng 1.");
        return;
    }
    
    // --- KẾT THÚC VALIDATION ---


    // 2. Chuẩn bị dữ liệu gửi đi
    const finalData = {
      ...data,
      discountValue: discountValueNum,
      // minOrderAmount là trường tùy chọn (không bắt buộc trên UI)
      minOrderAmount: Number(data.minOrderAmount) || 0,
      usageLimit: Number(data.usageLimit),
      userLimit: Number(data.userLimit),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };

    // 3. Xử lý maxDiscount: chỉ gửi nếu không phải là FIXED
    if (data.discountType !== "FIXED") {
      finalData.maxDiscount = Number(data.maxDiscount); 
    } else {
      // Đảm bảo không gửi maxDiscount nếu là FIXED
      delete finalData.maxDiscount;
    }

    onSubmit(finalData);
  };

  // Biến kiểm tra để disable trường Giảm tối đa
  const isMaxDiscountDisabled = formData.discountType === "FIXED";

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
                disabled={isMaxDiscountDisabled} // Vô hiệu hóa khi là FIXED
                className={`border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-400 outline-none ${
                  isMaxDiscountDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder={isMaxDiscountDisabled ? "Không áp dụng" : "Nhập giảm tối đa (VNĐ)"}
                // required chỉ áp dụng khi không bị disable (PERCENTAGE)
                required={!isMaxDiscountDisabled && formData.discountType === "PERCENTAGE"}
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