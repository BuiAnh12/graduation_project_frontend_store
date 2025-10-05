"use client";
import React, { useEffect, useState } from "react";

import { ClipLoader } from "react-spinners";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";

import LatestTab from "@/components/tabs/LatestOrderTab";
import VerifyTab from "@/components/tabs/VerifyOrderTab";
import HistoryTab from "@/components/tabs/HistoryOrderTab";

import localStorageService from "@/utils/localStorageService";

const page = () => {
  const storeData = localStorageService.getStore();
  const [storeId, setStoreId] = useState(localStorageService.getStoreId());
  const [tabData, setTabData] = useState([
    { label: "Mới", component: <LatestTab storeId={storeId} /> },
    { label: "Đã xác nhận", component: <VerifyTab storeId={storeId} /> },
    { label: "Lịch sử", component: <HistoryTab storeId={storeId} /> },
  ]);
  const [activeTab, setActiveTab] = useState(0); // Default tab index

  // Load the stored active tab index from localStorage when the page loads
  useEffect(() => {
    const savedTab = parseInt(localStorageService.getActiveTab());
    if (!isNaN(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (index) => {
    setActiveTab(index);
    localStorageService.setActiveTab(index);
  };

  if (!storeId) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <ClipLoader
          color="#fc6011"
          loading={true}
          size={80} // 👈 thay cho height/width
        />
      </div>
    );
  }

  return (
    <>
      <Header title="Đơn hàng" goBack={true} />
      <div className="pt-[70px] pb-[10px] bg-gray-100">
        <Tabs
          key={activeTab} // 👈 force re-render when either changes
          tabs={tabData}
          defaultActiveTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <NavBar page="orders" />
    </>
  );
};

export default page;
