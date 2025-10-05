import React from "react";
import IconCard from "../components/IconCard"; // Assuming IconCard is in the same directory

const icons = [
  { href: "/orders", src: "/assets/order.png", label: "Đơn hàng" },
  { href: "/menu", src: "/assets/dishes.png", label: "Thực đơn" },
  { href: "/store", src: "/assets/admin-icons/store.png", label: "Thông tin cửa hàng" },
  { href: "/staffs", src: "/assets/staff.png", label: "Quản lý nhân viên" },
  { href: "/rating", src: "/assets/star.png", label: "Đánh giá" },
  { href: "/staff", src: "/assets/user.png", label: "Quản lý nhân viên" },
  { href: "/voucher", src: "/assets/user.png", label: "Quản lý voucher" },
  { href: "/statistics", src: "/assets/report.png", label: "Báo cáo" },
];

const HomeContent = () => {
  return (
    <div className="p-5 shadow-md mb-48 mt-12">
      {/* Responsive grid layout */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {icons.map((icon, index) => (
          <IconCard
            key={index}
            href={icon.href}
            src={icon.src}
            label={icon.label}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
