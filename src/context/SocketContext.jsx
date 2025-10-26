"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import localStorageService from "@/utils/localStorageService";
import { toast } from "react-toastify";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URL || "";
export const SocketContext = createContext();
let globalSocket = null;
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const userIdRef = useRef(null);
  const storeIdRef = useRef(null);
  const isInitialized = useRef(false);

  // 🔹 Lấy userId & storeId ban đầu
  useEffect(() => {
    userIdRef.current = localStorageService.getUserId();
    storeIdRef.current = localStorageService.getStoreId();
  }, []);

  // ⚙️ Hàm khởi tạo socket
  const initSocket = () => {
    if (globalSocket) return globalSocket;
    if (!userIdRef.current) {
      console.warn("⚠️ Không có userId -> Không khởi tạo socket");
      return;
    }

    console.log("🔌 Connecting to Socket.io server:", ENDPOINT);
    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      newSocket.emit("registerUser", userIdRef.current);
      if (storeIdRef.current) {
        console.log("🏪 Registering store socket:", storeIdRef.current);
        newSocket.emit("registerStore", storeIdRef.current);
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    // 🔁 Gỡ listener cũ trước khi đăng ký mới (tránh trùng)
    newSocket.off("getAllNotifications");
    newSocket.off("newNotification");
    newSocket.off("newOrderNotification");

    // 📦 Lắng nghe danh sách thông báo
    newSocket.on("getAllNotifications", (all) => {
      // use .id (socket.io client) instead of _id — _id can be undefined
      console.log("📬 Received all notifications:", newSocket.id);
      setNotifications(all || []);
    });

    // 🆕 Nhận thông báo mới
    newSocket.on("newNotification", (n) => {
      console.log("🆕 Received new notification:", n);
      setNotifications((prev) => [...prev, n]);
    });

    // 🛒 Nhận thông báo đơn hàng
    newSocket.on("newOrderNotification", (payload) => {
      console.log("🛒 Received new ORDER notification:", payload);
      toast.info("Có đơn hàng mới!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      if (payload?.notification) {
        setNotifications((prev) => [...prev, payload.notification]);
      }
    });

    // persist globally so subsequent calls reuse the same socket
    globalSocket = newSocket;
    setSocket(newSocket);
    isInitialized.current = true;
    return newSocket;
  };

  // 🚀 Kết nối socket lần đầu (chỉ 1 lần duy nhất)
  useEffect(() => {
    if (isInitialized.current) return; // tránh tạo socket 2 lần
    const s = initSocket();

    return () => {
      if (s) {
        console.log("❌ Disconnecting socket:", s.id);
        try {
          s.disconnect();
        } catch (e) {
          console.warn("Error disconnecting socket:", e);
        }
        if (globalSocket === s) globalSocket = null;
        isInitialized.current = false;
      }
    };
  }, []);

  // 🔄 Theo dõi thay đổi userId/storeId từ localStorage (chỉ khi thay đổi thật)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== "userId" && e.key !== "storeId") return;

      const newUserId = localStorageService.getUserId();
      const newStoreId = localStorageService.getStoreId();

      if (
        newUserId !== userIdRef.current ||
        newStoreId !== storeIdRef.current
      ) {
        console.log("🔁 userId/storeId thay đổi → reconnect socket");
        userIdRef.current = newUserId;
        storeIdRef.current = newStoreId;

        if (socket) {
          try {
            socket.disconnect();
          } catch (e) {
            console.warn("Error disconnecting socket:", e);
          }
          if (globalSocket === socket) globalSocket = null;
          isInitialized.current = false;
          setSocket(null);
        }
        initSocket();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [socket]);

  // 📤 Gửi thông báo
  const sendNotification = (payload) => {
    if (socket) {
      console.log("📤 Sending notification:", payload);
      socket.emit("sendNotification", payload);
    } else {
      console.warn("⚠️ Socket chưa sẵn sàng để gửi notification");
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, setNotifications, sendNotification }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
