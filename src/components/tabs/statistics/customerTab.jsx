"use client";

import { useEffect, useState } from "react";
import {
  getReturningCustomerRate,
  getAverageSpendingPerOrder,
  getNewCustomers,
} from "@/service/statistic";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#f87171"]; // Returning: green, New: red

export default function CustomerTab() {
  const [returnRate, setReturnRate] = useState(0);
  const [avgSpending, setAvgSpending] = useState(0);
  const [newCustomerStats, setNewCustomerStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rateRes, avgRes, newCusRes] = await Promise.all([
        getReturningCustomerRate(),
        getAverageSpendingPerOrder(),
        getNewCustomers(),
      ]);

      setReturnRate(rateRes?.data?.returningRate ?? 0);
      setAvgSpending(avgRes?.data?.averageSpending ?? 0);
      setNewCustomerStats({
        today: newCusRes?.data?.today ?? 0,
        thisWeek: newCusRes?.data?.thisWeek ?? 0,
        thisMonth: newCusRes?.data?.thisMonth ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch customer stats:", error);
    }
  };

  const returnChartData = [
    { name: "Khách quay lại", value: returnRate },
    { name: "Khách mới", value: 100 - returnRate },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Tỷ lệ khách quay lại"
          value={`${returnRate.toFixed(1)}%`}
        />
        <SummaryCard
          title="Chi tiêu trung bình / đơn"
          value={`${avgSpending.toLocaleString()}₫`}
        />
        <SummaryCard
          title="Khách mới (Tháng)"
          value={newCustomerStats.thisMonth.toLocaleString()}
        />
      </div>

      {/* Pie Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Tỉ lệ quay lại</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={returnChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              >
                {returnChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              {/* <Tooltip formatter={(v) => `${v.toFixed(1)}%`} /> */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optional breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          title="Khách mới (Hôm nay)"
          value={newCustomerStats.today.toLocaleString()}
        />
        <SummaryCard
          title="Khách mới (Tuần này)"
          value={newCustomerStats.thisWeek.toLocaleString()}
        />
        <SummaryCard
          title="Khách mới (Tháng này)"
          value={newCustomerStats.thisMonth.toLocaleString()}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
