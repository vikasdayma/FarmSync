
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FiGrid,
  FiHome,
  FiPieChart,
  FiCloud,
  FiTrendingUp,
  FiFileText,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { useOrderCount } from "@/hooks/useOrderCount";
import { useProductCount } from "@/hooks/useProductCount";
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);



const Icons = {
  dashboard: <FiGrid size={20} />,
  farm: <FiHome size={20} />,
  crops: <FiPieChart size={20} />,
  weather: <FiCloud size={20} />,
  market: <FiTrendingUp size={20} />,
  reports: <FiFileText size={20} />,
  alerts: <FiBell size={20} />,
  settings: <FiSettings size={20} />,
  help: <FiHelpCircle size={20} />,
  logout: <FiLogOut size={20} />,
  chevronLeft: <FiChevronLeft size={16} />,
  chevronRight: <FiChevronRight size={16} />,
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: Icons.dashboard },
      { label: "My Store", href: "/dashboard/mystore", icon: Icons.market, badge: 3 },
    ],
  },
  {
    title: "Farm Management",
    items: [
      { label: "My Farm", href: "/dashboard/my-farm", icon: Icons.farm },
      { label: "Orders", href: "/dashboard/orders", icon: Icons.weather },
    ],
  },
  {
    title: "Business",
    items: [
    //   { label: "Messages", href: "/dashboard/messages", icon: Icons.reports },
      { label: "Alerts", href: "/dashboard/notification", icon: Icons.alerts, badge: 0 },
    ],
  },
];

function isActive(itemHref: string, pathname: string): boolean {
  if (itemHref === "/dashboard") return pathname === "/dashboard";
  return pathname === itemHref || pathname.startsWith(itemHref + "/");
}

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

// Reusable icon tile: dark filled circle when active, ghost-hover otherwise.
// Shared by nav items + footer links so the whole rail feels consistent.
function IconTile({
  icon,
  active,
  badge,
}: {
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
}) {
  return (
    <span
      className={`
        relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full
        transition-all duration-200
        ${
          active
            ? "bg-[#12331F] text-white shadow-md shadow-[#12331F]/20"
            : "text-[#12331F]/45 group-hover:bg-[#12331F]/6 group-hover:text-[#12331F]"
        }
      `}
    >
      {icon}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[9px] font-bold text-white ring-2 ring-white">
          {badge}
        </span>
      ) : null}
    </span>
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: countNotification = 0, isLoading } = useNotificationCount()
  console.log(countNotification)
  const {data:countOrder}=useOrderCount({role:'seller'});
  console.log(countOrder)
  const {data:countProdcut}=useProductCount();

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40
        flex h-screen flex-col
        border-r border-black/[0.06] bg-[#FBFBF8]
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[84px]" : "w-64"}
      `}
      style={{ boxShadow: "2px 0 16px rgba(15,61,46,0.05)" }}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-5 py-5 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12331F] text-lg">
          🌾
        </div>

        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-[#12331F]">FarmSync</div>
            <div className="text-[10px] uppercase tracking-wide text-[#12331F]/40">
              Dashboard
            </div>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`ml-auto flex h-7 w-7 items-center justify-center rounded-full text-[#12331F]/40 hover:bg-[#12331F]/6 hover:text-[#12331F] ${
            collapsed ? "absolute -right-3 top-6 border border-black/[0.06] bg-white shadow-sm" : ""
          }`}
        >
          {collapsed ? Icons.chevronRight : Icons.chevronLeft}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-hidden px-3 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <div className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-wide text-[#12331F]/35">
                {group.title}
              </div>
            )}

            <div className={`flex flex-col gap-3 ${collapsed ? "items-center" : ""}`}>
              {group.items.map((item) => {
                const active = isActive(item.href, pathname);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`
                      group relative flex items-center gap-3 rounded-2xl
                      text-sm font-medium transition-colors
                      ${collapsed ? "w-fit p-0.5" : "w-full px-1.5 py-0.5"}
                      ${active ? "" : "hover:bg-transparent"}
                    `}
                  >
                    <IconTile icon={item.icon} active={active} 
                 badge={
  item.label === 'Alerts'
    ? (countNotification || undefined)
    : item.label === 'Orders'
    ? (countOrder || undefined)
    : item.label==='My Store'
    ?(countProdcut || undefined)
    : undefined
}
></IconTile>
                    {!collapsed && (
                      <span
                        className={`truncate ${
                          active ? "font-semibold text-[#12331F]" : "text-[#12331F]/60"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}

                    {/* tooltip for icon-only mode */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[#12331F] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity  z-50">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`flex flex-col gap-1 border-t border-black/[0.06] px-3 py-3 ${collapsed ? "items-center" : ""}`}>
        <Link
          href="/dashboard/settings"
          title={collapsed ? "Settings" : undefined}
          className={`group relative flex items-center gap-3 rounded-2xl ${
            collapsed ? "w-fit p-0.5" : "w-full px-1.5 py-0.5"
          }`}
        >
          <IconTile icon={Icons.settings} active={isActive("/dashboard/settings", pathname)} />
          {!collapsed && <span className="text-[#12331F]/60">Settings</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[#12331F] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50">
              Settings
            </span>
          )}
        </Link>

        <Link
          href="/dashboard/help"
          title={collapsed ? "Help" : undefined}
          className={`group relative flex items-center gap-3 rounded-2xl ${
            collapsed ? "w-fit p-0.5" : "w-full px-1.5 py-0.5"
          }`}
        >
          <IconTile icon={Icons.help} active={isActive("/dashboard/help", pathname)} />
          {!collapsed && <span className="text-[#12331F]/60">Help</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[#12331F] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50">
              Help
            </span>
          )}
        </Link>
      </div>


      {/* <div className={`border-t border-black/[0.06] p-3 ${collapsed ? "flex justify-center" : ""}`}>
        <LogoutButton className={collapsed ? "" : "min-w-60"} />
      </div> */}
    </aside>
  );
}