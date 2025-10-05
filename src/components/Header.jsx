"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import useLogout from "@/hooks/useLogout";
import localStorageService from "@/utils/localStorageService";

const Header = ({ title, goBack }) => {
  const router = useRouter();
  const logoutUser = useLogout();
  
  if (!title) {
    const storeName = localStorageService.getStore()?.name;
    console.log("Store name from localStorage:", localStorageService.getStore());
    title = storeName;
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      router.push("/auth/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
      {/* Left Side: Back Button or Title */}
      <div className="flex items-center space-x-4">
        {goBack && (
          <button onClick={() => router.back()} className="p-1 rounded hover:bg-gray-100">
            <Image
              src="/assets/back.png"
              alt="Back"
              width={28}
              height={28}
              className="cursor-pointer"
            />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>

      {/* Right Side: Notification + User */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <Link href="/notifications" className="hover:opacity-80">
          <Image
            src="/assets/notification.png"
            alt="Notifications"
            width={22}
            height={22}
            className="cursor-pointer"
          />
        </Link>

        {/* Dropdown User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none hover:opacity-80">
              <Image
                src="/assets/user.png"
                alt="User"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-white border rounded-md shadow-lg mt-2 w-40 text-sm"
            sideOffset={8}
          >
            <DropdownMenuItem className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Link href="/profile" className="block w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
