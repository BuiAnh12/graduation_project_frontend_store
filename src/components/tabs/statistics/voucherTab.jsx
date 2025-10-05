'use client';

import React, { useEffect, useState } from 'react';
import {
  getVoucherUsageSummary,
  getTopUsedVouchers,
  getVoucherRevenueImpact,
} from '@/service/statistic';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const VoucherTab = () => {
  const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-01'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [limit, setLimit] = useState(5);

  const [usageSummary, setUsageSummary] = useState(null);
  const [topVouchers, setTopVouchers] = useState([]);
  const [revenueImpact, setRevenueImpact] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [summaryRes, topRes, revenueRes] = await Promise.all([
        getVoucherUsageSummary(from, to),
        getTopUsedVouchers(limit),
        getVoucherRevenueImpact(),
      ]);

      setUsageSummary(summaryRes?.data || {});
      setTopVouchers(topRes?.data || []);
      setRevenueImpact(revenueRes?.data || {});
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [from, to, limit]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Từ ngày</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Đến ngày</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Top voucher</label>
          <input
            type="number"
            min="1"
            max="100"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border p-2 rounded w-24"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Usage Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Tổng quan sử dụng</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard title="Số lượt sử dụng" value={usageSummary?.totalUsed || 0} />
              <SummaryCard title="Số voucher đã phát hành" value={usageSummary?.totalIssued || 0} />
              <SummaryCard title="Tỷ lệ sử dụng" value={`${usageSummary?.usageRate?.toFixed(1) || 0}%`} />
            </div>
          </div>

          {/* Top Used Vouchers */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Top {limit} Voucher được sử dụng</h3>
            {topVouchers.length === 0 ? (
              <p className="text-gray-500">Không có dữ liệu</p>
            ) : (
              <ul className="list-disc pl-5">
                {topVouchers.map((voucher, idx) => (
                  <li key={voucher._id}>
                    <span className="font-semibold">{voucher.code}</span> - {voucher.usedCount} lượt
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Revenue Impact */}
          <div>
            <h3 className="text-lg font-medium mb-2">Ảnh hưởng doanh thu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryCard
                title="Tổng doanh thu giảm do áp dụng voucher"
                value={`${(revenueImpact?.revenueLost || 0).toLocaleString()}₫`}
              />
              <SummaryCard
                title="Tổng giá trị đơn hàng sử dụng voucher"
                value={`${(revenueImpact?.totalVoucherOrderValue || 0).toLocaleString()}₫`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div className="bg-gray-50 p-4 rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default VoucherTab;
