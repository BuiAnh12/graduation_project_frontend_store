"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  ShoppingCart,
  Star,
  Users,
  TicketPercent,
} from "lucide-react";
import Protected from "../../hooks/useRoleProted";
import Header from "@/components/Header";
const tabs = [
  {
    key: "revenue",
    label: "Doanh thu",
    icon: <BarChart2 className="w-4 h-4" />,
  },
  {
    key: "orders",
    label: "Đơn hàng",
    icon: <ShoppingCart className="w-4 h-4" />,
  },
  { key: "items", label: "Top Sản phẩm", icon: <Star className="w-4 h-4" /> },
  {
    key: "customers",
    label: "Khách hàng",
    icon: <Users className="w-4 h-4" />,
  },
  {
    key: "vouchers",
    label: "Vouchers",
    icon: <TicketPercent className="w-4 h-4" />,
  },
];

export default function StatisticsLayout({ children }) {
  const pathname = usePathname();
  const activeTab = pathname.split("/")[2] || "revenue";

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Statistics Dashboard</h1>

      <div className="flex flex-wrap gap-2 border-b mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/statistics/${tab.key}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium border-b-2 transition
              ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600 bg-white"
                  : "border-transparent text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-6 min-h-[300px] mb-40">
        {children}
      </div>
    </div>
  );
}
