"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useGetMeQuery } from "@/redux/api/authApi";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  refreshOnlineUsers: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  refreshOnlineUsers: () => { },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const { data: userData } = useGetMeQuery({});
  const currentUser = userData?.data?.data || userData?.data;
  const currentUserId = currentUser?.id;

  useEffect(() => {
    // Only connect if we have a user ID
    if (!currentUserId) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_API || "http://localhost:3000", {
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected for user:", currentUserId);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setOnlineUsers(new Set()); // Clear online users when we disconnect
      console.log("Socket disconnected");
    });

    socketInstance.on("onlineUsers", (userIds: string[]) => {
      console.log("Online users synced:", userIds);
      setOnlineUsers(new Set(userIds));
    });

    socketInstance.on("statusUpdate", (data: { userId: string, isOnline: boolean }) => {
      console.log("User status update:", data);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isOnline) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUserId]);

  const refreshOnlineUsers = () => {
    if (socket && isConnected) {
      socket.emit("getOnlineUsers");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, refreshOnlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
