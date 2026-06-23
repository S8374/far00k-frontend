"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowDown } from "react-icons/md";
import { toast } from "sonner";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useSocket } from "@/provider/SocketProvider";

interface UserProfileDropdownProps {
  user: any;
  className?: string;
}

export default function UserProfileDropdown({
  user,
  className,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { socket } = useSocket();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      // Emit quick logout to socket server
      if (socket) {
        socket.emit("logout");
      }

      const res = await logout({}).unwrap();
      if (res.success) {
        toast.success(res.message);
        setIsOpen(false);
        router.refresh();
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-2.5 p-1.5 rounded-full",
          "hover:bg-white/10 transition-all duration-200",
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 focus:ring-offset-zinc-950",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          
            <Avatar
              size={36}
              icon={<UserOutlined />}
              className="bg-linear-to-br from-emerald-600 to-teal-700"
            />
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-zinc-950 rounded-full" />
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
            {user?.fullName?.split(" ")[0] || "User"}
          </span>
          <MdKeyboardArrowDown
            className={cn(
              "w-5 h-5 text-zinc-400 group-hover:text-emerald-300 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute right-0 mt-3 w-72 sm:w-80 -mr-6",
              "bg-zinc-900/95 backdrop-blur-xl",
              "border border-white/10 rounded-2xl shadow-2xl shadow-black/60",
              "overflow-hidden z-50",
            )}
          >
            {/* User Info Header */}
            <div className="px-5 pt-5 pb-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                  <Avatar
                    size={56}
                    icon={<UserOutlined />}
                    className="bg-linear-to-br from-emerald-500 to-teal-600 ring-2 ring-emerald-500/20"
                  />
                <div>
                  <h4 className="font-semibold text-lg text-white">
                    {user?.fullName || "Unnamed User"}
                  </h4>
                  <p className="text-sm text-zinc-400">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  user.role === "AGENT" || user.role === "ADMIN" ? router.push("/dashboard") : router.push("/dashboard/profile-settings");
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3.5",
                  "text-zinc-200 hover:bg-white/5 hover:text-emerald-300",
                  "transition-colors duration-200 cursor-pointer",
                )}
              >
                <DashboardOutlined className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3.5",
                  "text-zinc-200 hover:bg-white/5 hover:text-red-400",
                  "transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                <LogoutOutlined className="w-5 h-5" />
                <span className="font-medium">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
