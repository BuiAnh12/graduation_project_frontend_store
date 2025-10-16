'use client';

import React from "react";
import Header from "@/components/Header"
import Tabs from "@/components/Tabs"
import DishTab from "@/components/tabs/DishMenuTab"
import ToppingTab from "@/components/tabs/ToppingMenuTab"
const page = () => {
  const tabData = [
    { label: "Món ăn", component: <DishTab /> },
    { label: "Topping", component: <ToppingTab /> },
  ];
  return (
    <>

      <Header title="Thực đơn" goBack={true} />
      <div className='pt-[70px] pb-[10px] bg-gray-100'>
        <Tabs
          tabs={tabData}
          defaultActiveTab={0}
          onTabChange={(index) => console.log("Active tab changed to:", index)}
        />
      </div>

    </>
  );
};

export default page;