"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrder } from "@/service/order";
import Header from "@/components/Header";
import LatestOrder from "@/components/fragments/LatestOrder";
import ConfirmedOrder from "@/components/fragments/ConfirmedOrder";
import HistoryOrder from "@/components/fragments/HistoryOrder";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        console.log(id);
        setIsLoading(true);
        const response = await getOrder({ orderId: id });
        console.log(response);
        setOrder(response?.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Lỗi khi tải đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (!id) return <p>Invalid Order ID</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Không tìm thấy đơn hàng</p>;

  const getOrderComponent = () => {
    console.log(order);
    switch (order?.status) {
      case "pending":
        return <LatestOrder order={order} />;
      case "confirmed":
      case "finished":
        return <ConfirmedOrder order={order} />;
      case "delivered":
      case "cancelled":
        return <HistoryOrder order={order} />;
      default:
        return <p>Không xác định trạng thái đơn hàng</p>;
    }
  };

  return (
    <>
      <Header title="Chi tiết đơn hàng" goBack={true} />
      {getOrderComponent()}
    </>
  );
};

export default OrderDetailsPage;
