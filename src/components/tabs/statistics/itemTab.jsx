"use client";

import { useEffect, useState } from "react";
import {
    getTopSellingItems,
    getRevenueContributionByItem,
} from "@/service/statistic";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

const COLORS = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#a855f7",
    "#14b8a6",
    "#f97316",
    "#84cc16",
    "#e11d48",
];

export default function TopItemsTab() {
    const [limit, setLimit] = useState(5);
    const [topSelling, setTopSelling] = useState([]);
    const [revenueItems, setRevenueItems] = useState([]);

    const fetchData = async () => {
        const top = await getTopSellingItems(limit);
        const revenue = await getRevenueContributionByItem(limit);

        console.log(top);
        console.log(revenue);

        setTopSelling(top.data || []);
        setRevenueItems(revenue.data || []);
    };

    useEffect(() => {
        fetchData();
    }, [limit]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium">
                    🔢 Number of items to show:
                </label>
                <input
                    type="number"
                    min={1}
                    max={20}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
            </div>

            {/* Top-Selling Items */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    🔥 Top Selling Items
                </h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topSelling}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="dishName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="sold"
                                fill="#10b981"
                                name="Quantity Sold"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Revenue Contribution */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    💰 Revenue by Item
                </h3>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={revenueItems}
                                dataKey="contribution"
                                nameKey="dishName"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={({ dishName, contribution }) =>
                                    `${dishName} (${contribution}%)`
                                }
                            >
                                {revenueItems.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
