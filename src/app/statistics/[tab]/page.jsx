import RevenueTab from "@/components/tabs/statistics/revenueTab";
import OrderTab from "@/components/tabs/statistics/orderTab";
import TopItemsTab from "@/components/tabs/statistics/itemTab";
import CustomerTab from "@/components/tabs/statistics/customerTab";
import VoucherTab from "@/components/tabs/statistics/voucherTab";
import Header from "@/components/Header";
// React icons
import {
  FiBarChart2,
  FiPackage,
  FiStar,
  FiUsers,
  FiGift,
} from "react-icons/fi";

export default async function TabPage({ params }) {
  const { tab } = await params;

  const renderTabContent = () => {
    switch (tab) {
      case "revenue":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FiBarChart2 className="text-blue-500" size={22} />
              Tổng kết Doanh thu
            </h2>
            <RevenueTab />
          </div>
        );
      case "orders":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FiPackage className="text-green-500" size={22} />
              Thống kê Đơn hàng
            </h2>
            <OrderTab />
          </div>
        );
      case "items":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FiStar className="text-yellow-500" size={22} />
              Sản phẩm nổi bật
            </h2>
            <TopItemsTab />
          </div>
        );
      case "customers":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FiUsers className="text-purple-500" size={22} />
              Thông tin Khách hàng
            </h2>
            <CustomerTab />
          </div>
        );
      case "vouchers":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FiGift className="text-pink-500" size={22} />
              Hiệu suất Voucher
            </h2>
            <VoucherTab />
          </div>
        );
      default:
        return <p className="text-red-500">Invalid tab</p>;
    }
  };

  return (
    <>
      <Header title="Báo cáo" goBack={true} />
      {renderTabContent()}
    </>
  );
}
