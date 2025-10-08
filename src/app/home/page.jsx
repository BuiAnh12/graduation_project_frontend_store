import React from "react";
import Header from "@/components/Header"
import HomeContent from "@/components/HomeContent"
const page = () => {
  return (
    <>
      <Header/>
      <div className='bg-white pt-[30px] pb-[100px] px-[20px]'>
      
      <HomeContent/>

      </div>
    </>
  );
};

export default page;