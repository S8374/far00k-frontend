"use client";
import { ReactNode, useRef, useState } from "react";
import {
  Menu,
  X,
  Home,
  User,
  IdCard,
  ShieldCheck,
  Heart,
  Banknote,
  MessageSquare,
  FileText,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "sonner";
import Image from "next/image";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { useGetMeQuery } from "@/redux/api/authApi";
import DashboardLayoutSkeleton from "@/components/modules/Skeleton/DashboardLayoutSkeleton";
import PrivateRoute from "@/routes/PrivateRoute";
// changed
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: userData, isLoading } = useGetMeQuery({});
  const user = userData?.data?.data || userData?.data;

  /* ---------------- Logout ---------------- */
  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Log out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        router.push("/login");
        toast.success("Logged out successfully");
      }
    });
  };

  /* ---------------- Menu Items ---------------- */
  const menuItems =
    user?.role === "AGENT"
      ? [
        { icon: Home, text: "Dashboard", path: "/dashboard" },
        {
          icon: FileText,
          text: "My Properties",
          path: "/dashboard/my-properties",
        },
        { icon: MessageSquare, text: "Messages", path: "/dashboard/message" },
        {
          icon: User,
          text: "Profile & Settings",
          path: "/dashboard/profile-settings",
        },
        { icon: Banknote, text: "Payments", path: "/dashboard/payments" },
      ]
      : user?.role === "ADMIN"
        ? [
          { icon: Home, text: "Dashboard", path: "/dashboard" },
          { icon: User, text: "User Management", path: "/dashboard/user-management" },
          { icon: ShieldCheck, text: "Agent Verification", path: "/dashboard/agent-verification" },
          { icon: FileText, text: "Property Verification", path: "/dashboard/property-verification" },
          { icon: Banknote, text: "Verify Payment", path: "/dashboard/verify-payment" },
          { icon: IdCard, text: "KYC Verification", path: "/dashboard/kyc-verification" },
          { icon: Building2, text: "Developers", path: "/dashboard/developers" },
        ]
        : [
          {
            icon: User,
            text: "Profile & Settings",
            path: "/dashboard/profile-settings",
          },
          { icon: MessageSquare, text: "Messages", path: "/dashboard/message" },
          { icon: Heart, text: "Save", path: "/dashboard/save" },
          { icon: Banknote, text: "Payments", path: "/dashboard/payments" },
        ];

  /* ---------------- Sidebar Width ---------------- */
  const sidebarWidth = collapsed ? "w-20" : "w-64";
  const contentPadding = collapsed ? "lg:pl-20" : "lg:pl-64";
  const headerLeft = collapsed ? "lg:left-20" : "lg:left-64";
  if (isLoading) {
    return <DashboardLayoutSkeleton />;
  }
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        {/* ================= Sidebar ================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth}
        bg-[#1e1e1e] border-r border-zinc-800
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        >
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
            {!collapsed && (
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Image src="/sakk.png" alt="logo" width={35} height={35} />
                <span className="tracking-wide">Sakk</span>
              </Link>
            )}

            <div className="flex items-center gap-2">
              {/* Collapse */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-md hover:bg-emerald-600 transition"
              >
                {collapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Close */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md lg:hidden hover:bg-emerald-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {menuItems.map((item, index) => {
              const isActive =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={index}
                  href={item.path}
                  className={`flex items-center ${collapsed ? "justify-center" : ""
                    } gap-3 px-4 py-3 rounded-lg transition-all duration-300
                ${isActive
                      ? "bg-emerald-600 text-white shadow-md"
                      : "hover:bg-emerald-500/20 text-zinc-300"
                    }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.text}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ================= Main Content ================= */}
        <div className={`transition-all duration-300 ${contentPadding}`}>
          {/* Header */}
          <header
            className={`fixed top-0 right-0 left-0 ${headerLeft}
          h-16 bg-[#1e1e1e] border-b border-zinc-800
          flex items-center justify-between px-6 z-40 transition-all duration-300`}
          >
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-emerald-600"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Right Side */}
            <div className="ml-auto">
              {!user ? (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="border border-red-500 text-red-400 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div ref={dropdownRef}>
                  <UserProfileDropdown user={user} />
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <main className="pt-20 px-6 pb-10 min-h-screen">
            {children}
          </main>
        </div>

        {/* ================= Overlay (Mobile) ================= */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;