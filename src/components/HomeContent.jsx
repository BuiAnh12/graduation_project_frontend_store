"use client";
import React, { useEffect, useState } from "react";
import IconCard from "../components/IconCard";
import localStorageService from "@/utils/localStorageService";
import { jwtDecode } from "jwt-decode";

const icons = [
  {
    href: "/orders",
    src: "/assets/order.png",
    label: "Đơn hàng",
    roles: ["STORE_OWNER", "MANAGER", "STAFF"],
  },
  {
    href: "/menu",
    src: "/assets/dishes.png",
    label: "Thực đơn",
    roles: ["STORE_OWNER", "MANAGER"],
  },
  {
    href: "/store",
    src: "/assets/admin-icons/store.png",
    label: "Thông tin cửa hàng",
    roles: ["STORE_OWNER", "MANAGER"],
  },
  {
    href: "/rating",
    src: "/assets/star.png",
    label: "Đánh giá",
    roles: ["STORE_OWNER", "MANAGER"],
  },
  {
    href: "/staff",
    src: "/assets/staff.png",
    label: "Quản lý nhân viên",
    roles: ["STORE_OWNER"],
  },
  {
    href: "/vouchers",
    src: "/assets/promo-code.png",
    label: "Quản lý voucher",
    roles: ["STORE_OWNER"],
  },
  {
    href: "/statistics",
    src: "/assets/report.png",
    label: "Báo cáo",
    roles: ["STORE_OWNER"],
  },
];

const HomeContent = () => {
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    try {
      const token = localStorageService.getToken();
      if (token) {
        const decoded = jwtDecode(token);
        const roles = Array.isArray(decoded.role)
          ? decoded.role
          : [decoded.role];
        setUserRoles(roles);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }, []);

  const visibleIcons = icons.filter((icon) =>
    icon.roles.some((r) => userRoles.includes(r))
  );

  return (
    <div className="p-5 shadow-md mb-48 mt-12 bg-white">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {visibleIcons.map((icon, index) => (
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
