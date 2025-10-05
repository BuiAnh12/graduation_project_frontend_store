import moment from "moment";
import React from "react";

const Notification = ({ notification, handleNotificationStatusChange }) => {
  return (
    <div
      onClick={() => {
        handleNotificationStatusChange(notification._id);
      }}
      className={`flex items-center gap-[20px] cursor-pointer py-[10px] px-[20px] mb-[1px] ${
        notification.status === "read" ? "bg-[#fff]" : "bg-[#eeeeeeee]"
      }`}
    >
      {notification.status === "read" ? (
        <div className='w-[10px] h-[10px] rounded-full bg-[#e8e9e9]'></div>
      ) : (
        <div className='w-[10px] h-[10px] rounded-full bg-[#fc6011]'></div>
      )}

      <div className=''>
        <p
          className={`line-clamp-1 font-medium text-[16px] ${
            notification.status === "read" ? "text-[#939393]" : "text-black"
          }`}
        >
          {notification.title}
        </p>
        <p
          className={`line-clamp-2 text-[14px] ${notification.status === "read" ? "text-[#939393]" : "text-[#4a4b4d]"}`}
        >
          {notification.message}
        </p>
        <p className={`text-[12px] ${notification.status === "read" ? "text-[#939393]" : "text-[#4A4B4D]"}`}>
          {moment(notification?.createdAt).format("DD/MM/YYYY HH:mm")}
        </p>
      </div>
    </div>
  );
};

export default Notification;
