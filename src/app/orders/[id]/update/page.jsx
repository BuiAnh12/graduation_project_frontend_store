"use client";
import Header from "@/components/Header";
import OrderEditor from "@/components/orders/update/OrderEditor";

export default function UpdateOrderPage() {
  return (
    <>
      <Header title="Sửa đơn hàng" goBack={true} />
      <OrderEditor />
    </>
  );
}