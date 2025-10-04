import NavBar from "@/components/NavBar";
import React from "react";
import Header from "@/components/Header"
import HomeContent from "@/components/HomeContent"
const page = () => {
  return (
    <>
      <Header/>
      <div className='pt-[30px] pb-[100px] px-[20px]'>
      
      <HomeContent/>

      </div>
      <NavBar page='home' />
    </>
  );
};

export default page;