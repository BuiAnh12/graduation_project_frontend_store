"use client";

import { useEffect, useState } from "react";
import {
  getRevenueByCategory,
  getRevenueSummary,
  getRevenueByDay,
  getRevenueByItem,
} from "@/service/statistic";
import dayjs from "dayjs";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import axios from "@/libs/axiosInstance";

export default function RevenueTab() {
  const [summary, setSummary] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState(null); // object
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [fromDate, setFromDate] = useState(
    dayjs().subtract(6, "day").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  const fetchData = async (from = fromDate, to = toDate) => {
    // not toptimze because refetch all the API
    try {
      const from = dayjs().subtract(6, "day").format("YYYY-MM-DD"); // Last 7 days
      const to = dayjs().format("YYYY-MM-DD");

      const s = await getRevenueSummary();
      const daily = await getRevenueByDay(from, to);
      const cat = await getRevenueByCategory();
      const items = await getRevenueByItem();

      console.log(s.data);
      console.log(daily.data);
      console.log(cat.data);
      console.log("📊 Top items response:", items.data);

      setSummary(s.data);
      setDailyRevenue(daily.data);
      setCategoryRevenue(cat.data);
      const itemList = Array.isArray(items?.data) ? items?.data : items?.data;
      setTopItems(Array.isArray(itemList) ? itemList : []);
    } catch (error) {
      console.error("❌ Failed to fetch revenue data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!summary) return <p className="text-gray-500">Loading revenue data...</p>;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Hôm nay" amount={summary.today} />
        <SummaryCard title="Tuần này" amount={summary.week} />
        <SummaryCard title="Tháng này" amount={summary.month} />
      </div>

      {/* Filter section */}
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm text-gray-600 mr-2">Từ</label>
          <input
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mr-2">đến</label>
          <input
            type="date"
            value={toDate}
            min={fromDate}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={() => fetchData(fromDate, toDate)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Lọc
        </button>
      </div>

      {/* Revenue over time */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Doanh thu theo ngày</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyRevenue}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by category */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Doanh thu theo danh mục</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalRevenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top items */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          5 sản phầm có doanh thu cao nhất
        </h3>
        <ul className="divide-y divide-gray-200">
          {Array.isArray(topItems) && topItems.length > 0 ? (
            topItems.map((item, idx) => (
              <li key={idx} className="py-2 flex justify-between">
                <span>{item.dishName}</span>
                <span className="font-medium text-gray-700">
                  {formatVND(item.totalRevenue)}
                </span>
              </li>
            ))
          ) : (
            <li className="py-2 text-sm text-gray-500">No data available</li>
          )}
        </ul>
      </div>
    </div>
  );
}

// SummaryCard component
function SummaryCard({ title, amount }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-bold text-blue-600">{formatVND(amount)}</p>
    </div>
  );
}

// Helper
function formatVND(amount) {
  return (
    amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }) ?? "₫0"
  );
}
