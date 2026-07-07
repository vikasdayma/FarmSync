"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "▦" },
      { label: "Farms", href: "/admin/all-farms", icon: "↗" },
      { label: "Reports", href: "/admin/reports", icon: "≡" },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: "◎" },
      { label: "Farms", href: "/admin/farms", icon: "◈" },
    //   { label: "Orders", href: "/admin/orders", icon: "⊞" },
    //   { label: "Loans", href: "/admin/loans", icon: "◇" },
    //   { label: "Subsidies", href: "/admin/subsidies", icon: "◆" },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Audit Logs", href: "/admin/audit-logs", icon: "⊙" },
    //   { label: "Settings", href: "/admin/settings", icon: "⊕" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) router.replace("/login");
    } catch {
      console.log("Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-[#0a0a0a] border-r border-white/[0.06] transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
              <span className="text-black text-xs font-black">A</span>
            </div>
            <span className="text-white text-sm font-semibold tracking-wide">AgriAdmin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center mx-auto">
            <span className="text-black text-xs font-black">A</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/30 hover:text-white transition-colors text-xs"
          >
            ←
          </button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="text-white/30 hover:text-white transition-colors text-xs py-2 text-center"
        >
          →
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
        {navGroups.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-[10px] uppercase tracking-widest text-white/20 px-3 mb-2">
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span className={`text-base flex-shrink-0 ${isActive ? "text-emerald-400" : "text-white/30 group-hover:text-white/60"}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="font-medium truncate">{item.label}</span>
                      )}
                      {isActive && !collapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom — profile + logout */}
      <div className="border-t border-white/[0.06] p-3 space-y-1">
        <Link
          href="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
            pathname === "/profile"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <span className="text-base flex-shrink-0 text-white/30 group-hover:text-white/60">◉</span>
          {!collapsed && <span className="font-medium">Profile</span>}
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 border border-transparent transition-all group"
        >
          <span className="text-base flex-shrink-0 text-white/30 group-hover:text-red-400">⊗</span>
          {!collapsed && <span className="font-medium">{loggingOut ? "Logging out..." : "Logout"}</span>}
        </button>
      </div>
    </aside>
  );
}