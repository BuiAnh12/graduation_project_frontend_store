"use client";

import { useState, useEffect } from "react";
import {
    getOrderSummaryStats,
    getOrderStatusRate,
    getOrdersOverTime,
    getOrderStatusDistribution,
    getOrdersByTimeSlot,
} from "@/service/statistic";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    CartesianGrid,
    Legend,
} from "recharts";

import DateRangePicker from "@/components/DateRangePicker";
import dayjs from "dayjs";

const STATUS_LABELS = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    finished: "Đã hoàn tất",
    taken: "Đã lấy món",
    delivering: "Đang giao",
    delivered: "Đã giao",
    done: "Hoàn thành",
    cancelled: "Đã huỷ",
};

const STATUS_COLORS = {
    pending: "#f59e0b",
    confirmed: "#3b82f6",
    finished: "#10b981",
    taken: "#6366f1",
    delivering: "#0ea5e9",
    delivered: "#22c55e",
    done: "#16a34a",
    cancelled: "#ef4444",
};

const PIE_COLORS = [
    "#34d399",
    "#f87171",
    "#60a5fa",
    "#fbbf24",
    "#a78bfa",
    "#f472b6",
    "#4ade80",
    "#facc15",
];

export default function OrderTab() {
    const [summary, setSummary] = useState(null);
    const [statusRate, setStatusRate] = useState(null);
    const [overTimeData, setOverTimeData] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState(null);
    const [timeSlotData, setTimeSlotData] = useState([]);
    const [fromDate, setFromDate] = useState(
        dayjs().subtract(6, "day").format("YYYY-MM-DD")
    );
    const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

    const fetchAllData = async () => {
        try {
            const [sum, rate, timeSlot] = await Promise.all([
                getOrderSummaryStats(),
                getOrderStatusRate(),
                getOrdersByTimeSlot(),
            ]);
            setSummary(sum.data);
            setStatusRate(rate.data);
            setTimeSlotData(timeSlot.data);

            if (fromDate && toDate) {
                const [time, dist] = await Promise.all([
                    getOrdersOverTime(fromDate, toDate),
                    getOrderStatusDistribution(fromDate, toDate),
                ]);
                setOverTimeData(Array.isArray(time.data) ? time.data : []);
                setStatusDistribution(dist.data);
            }
        } catch (err) {
            console.error("❌ Order tab fetch error:", err);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [fromDate, toDate]);

    const barChartData = statusDistribution
        ? Object.entries(statusDistribution).map(([key, value]) => ({
              status: STATUS_LABELS[key] || key,
              value,
              fill: STATUS_COLORS[key] || "#a3a3a3",
          }))
        : [];

    const pieChartData = statusRate
        ? Object.entries(statusRate).map(([key, value]) => ({
              name: key === "completed" ? "Đã hoàn tất" : "Đã huỷ",
              value,
          }))
        : [];

    return (
        <div className="space-y-6">
            {/* Summary */}
            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SummaryCard title="Hôm nay" count={summary.today} />
                    <SummaryCard title="Tuần này" count={summary.thisWeek} />
                    <SummaryCard title="Tháng này" count={summary.thisMonth} />
                </div>
            )}

            {/* Orders Over Time */}
            <div className="flex justify-between items-center">
                <DateRangePicker
                    from={fromDate}
                    to={toDate}
                    onChange={(from, to) => {
                        setFromDate(from);
                        setToDate(to);
                    }}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">
                    📅 Đơn hàng theo thời gian
                </h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={overTimeData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#3b82f6"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Completion vs Cancel Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        ✅ Tỷ lệ hoàn tất vs huỷ
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                outerRadius={100}
                                label
                            >
                                {pieChartData.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Distribution */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        📊 Phân phối trạng thái đơn
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Order">
                                {barChartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Orders by Time Slot */}
            {timeSlotData && timeSlotData.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">
                        🕒 Đơn hàng theo khung giờ
                    </h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timeSlotData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timeSlot" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="orders"
                                    name="Order"
                                    fill="#8b5cf6"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ title, count }) {
    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-xl font-bold text-green-600">{count}</p>
        </div>
    );
}
