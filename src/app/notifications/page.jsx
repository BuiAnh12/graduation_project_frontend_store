"use client";
import Header from "../../components/Header";
import Notification from "../../components/Notification";
import React, { useEffect, useState } from "react";
import { updateNotificationStatus } from "@/service/notification";
import { useSocket } from "@/context/SocketContext";
const page = () => {
  const { socket, notifications, setNotifications } = useSocket();
  const handleNotificationStatusChange = async (id) => {
    await updateNotificationStatus(id);

    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, status: "read" } : notif
      )
    );
  };

  return (
    <div className="pt-[30px] pb-[100px] md:pt-[75px]">
      <div className="hidden md:block">
        <Header page="notifications" />
      </div>

      <div className="pt-[20px] lg:w-[60%] md:w-[80%] md:mx-auto">
        {notifications &&
          notifications
            ?.slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((notification, index) => (
              <Notification
                key={index}
                notification={notification}
                handleNotificationStatusChange={handleNotificationStatusChange}
              />
            ))}
      </div>
    </div>
  );
};

export default page;
