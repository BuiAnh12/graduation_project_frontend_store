"use client";

import React from "react";
import Protected from "@/hooks/useRoleProtected";
import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";

const Page = () => {
  return (
    <Protected role={["STORE_OWNER", "MANAGER", "STAFF"]}>
      <Header />
      <div className="bg-white pt-[30px] pb-[100px] px-[20px]">
        <HomeContent />
      </div>
    </Protected>
  );
};

export default Page;
