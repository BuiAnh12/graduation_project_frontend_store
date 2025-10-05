import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBar = ({ page }) => {
  return (
    <div className='fixed bottom-0 right-0 left-0 pt-[5px] bg-[#fff] w-full h-[75px] px-[25px] shadow-[0px_-10px_40px_0px_rgba(110,110,110,0.45)]'>
      <div className='relative flex items-center justify-between h-full w-full'>
        <div className='flex items-center gap-[20px]'></div>
        <div className='flex items-center gap-[30px]'>
          <Link href='/home' className='flex flex-col  items-center gap-[1px]'>
            <Image
              src={`${page == "home" ? "/assets/home_active.png" : "/assets/home.png"}`}
              alt=''
              width={24}
              height={24}
            />
            <p className={`text-[12px] mt-1 ${page == "home" ? "text-[#fc6011]" : "text-[#4A4B4D]"}`}>Home</p>
          </Link>
        </div>

        <div className='flex items-center gap-[50px]'></div>
        <div className='flex items-center gap-[50px]'></div>
        <div className='flex items-center gap-[30px]'>
          <Link href='/orders' className='flex flex-col  items-center gap-[1px]'>
            <Image
              src={`${page == "orders" ? "/assets/order_active.png" : "/assets/order.png"}`}
              alt=''
              width={24}
              height={24}
            />
            <p className={`text-[12px] mt-1 ${page == "orders" ? "text-[#fc6011]" : "text-[#4A4B4D]"}`}>Đơn hàng</p>
          </Link>
        </div>
        <div className='flex items-center gap-[50px]'></div>
        <div className='flex items-center gap-[50px]'></div>
        <div className='flex items-center gap-[20px]'>
          <Link href='/menu' className='flex flex-col  items-center gap-[1px]'>
            <Image
              src={`${page == "menu" ? "/assets/dishes_active.png" : "/assets/dishes.png"}`}
              alt=''
              width={24}
              height={24}
            />
            <p className={`text-[12px] mt-1 ${page == "menu" ? "text-[#fc6011]" : "text-[#4A4B4D]"}`}>Món ăn</p>
          </Link>
        </div>
        <div className='flex items-center gap-[20px]'></div>
      </div>
    </div>
  );
};

export default NavBar;
