"use client";

import { useState } from "react";
import {
  FiUser,
  FiLock,
  FiBell,
  FiGlobe,
  FiCreditCard,
  FiTrash2,
  FiCamera,
  FiCheck,
} from "react-icons/fi";

type Tab = "profile" | "security" | "notifications" | "preferences" | "billing";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <FiUser size={18} /> },
  { id: "security", label: "Security", icon: <FiLock size={18} /> },
  { id: "notifications", label: "Notifications", icon: <FiBell size={18} /> },
  { id: "preferences", label: "Preferences", icon: <FiGlobe size={18} /> },
  { id: "billing", label: "Billing", icon: <FiCreditCard size={18} /> },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#12331F]" : "bg-black/10"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Vikas",
    lastName: "",
    email: "vikas@example.com",
    phone: "",
    bio: "",
  });

  // Notifications state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newMessages: true,
    marketplaceAlerts: false,
    weeklyDigest: true,
    smsAlerts: false,
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    language: "English",
    currency: "INR",
    theme: "System",
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#12331F]">Settings</h1>
          <p className="mt-1 text-sm text-[#12331F]/50">
            Manage your account, preferences, and notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
          {/* Sidebar tabs */}
          <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors md:w-full ${
                  activeTab === tab.id
                    ? "bg-[#12331F] text-white shadow-sm"
                    : "text-[#12331F]/60 hover:bg-[#12331F]/6 hover:text-[#12331F]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm">
            {/* ===== PROFILE TAB ===== */}
            {activeTab === "profile" && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#12331F]">
                  Profile Information
                </h2>
                <p className="mt-1 text-sm text-[#12331F]/50">
                  Update your personal details and photo.
                </p>

                {/* Avatar */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C9E86B] text-2xl font-bold text-[#12331F]">
                      {profile.firstName?.[0] ?? "U"}
                    </div>
                    <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#12331F] text-white shadow">
                      <FiCamera size={13} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#12331F]">
                      Profile photo
                    </p>
                    <p className="text-xs text-[#12331F]/45">
                      JPG or PNG. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      First Name
                    </label>
                    <input
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, firstName: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Last Name
                    </label>
                    <input
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, lastName: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, email: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, bio: e.target.value }))
                      }
                      rows={3}
                      placeholder="Tell buyers a little about your farm..."
                      className="mt-1.5 w-full resize-none rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === "security" && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#12331F]">
                  Password &amp; Security
                </h2>
                <p className="mt-1 text-sm text-[#12331F]/50">
                  Keep your account secure with a strong password.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="mt-1.5 w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#FDFCF9] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#12331F]">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-[#12331F]/50">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Toggle checked={false} onChange={() => {}} />
                </div>

                <div className="mt-8 rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    Danger Zone
                  </p>
                  <p className="mt-1 text-xs text-red-600/70">
                    Deleting your account is permanent and cannot be undone.
                  </p>
                  <button className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <FiTrash2 size={14} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* ===== NOTIFICATIONS TAB ===== */}
            {activeTab === "notifications" && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#12331F]">
                  Notification Preferences
                </h2>
                <p className="mt-1 text-sm text-[#12331F]/50">
                  Choose what you want to be notified about.
                </p>

                <div className="mt-6 divide-y divide-black/[0.06]">
                  {[
                    {
                      key: "orderUpdates" as const,
                      label: "Order updates",
                      desc: "Get notified when an order status changes.",
                    },
                    {
                      key: "newMessages" as const,
                      label: "New messages",
                      desc: "Alerts when a buyer or supplier messages you.",
                    },
                    {
                      key: "marketplaceAlerts" as const,
                      label: "Marketplace alerts",
                      desc: "Price changes and new listings in your category.",
                    },
                    {
                      key: "weeklyDigest" as const,
                      label: "Weekly digest",
                      desc: "A summary email of your activity each week.",
                    },
                    {
                      key: "smsAlerts" as const,
                      label: "SMS alerts",
                      desc: "Critical alerts sent via text message.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#12331F]">
                          {item.label}
                        </p>
                        <p className="text-xs text-[#12331F]/50">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[item.key]}
                        onChange={(v) =>
                          setNotifications((n) => ({ ...n, [item.key]: v }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== PREFERENCES TAB ===== */}
            {activeTab === "preferences" && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#12331F]">
                  General Preferences
                </h2>
                <p className="mt-1 text-sm text-[#12331F]/50">
                  Customize your experience.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Language
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, language: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Currency
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, currency: e.target.value }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-[#12331F] outline-none focus:border-[#12331F]/40 focus:ring-2 focus:ring-[#12331F]/10"
                    >
                      <option>INR</option>
                      <option>USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-[#12331F]/50">
                      Theme
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {["Light", "Dark", "System"].map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setPreferences((p) => ({ ...p, theme: t }))
                          }
                          className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                            preferences.theme === t
                              ? "border-[#12331F] bg-[#12331F] text-white"
                              : "border-black/10 text-[#12331F]/60 hover:bg-[#12331F]/5"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== BILLING TAB ===== */}
            {activeTab === "billing" && (
              <div className="p-6 sm:p-8">
                <h2 className="text-lg font-bold text-[#12331F]">
                  Billing &amp; Plan
                </h2>
                <p className="mt-1 text-sm text-[#12331F]/50">
                  Manage your subscription and payment methods.
                </p>

                <div className="mt-6 rounded-xl border border-[#C9E86B]/40 bg-[#C9E86B]/10 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#12331F]">
                        Free Plan
                      </p>
                      <p className="text-xs text-[#12331F]/50">
                        Up to 10 active listings
                      </p>
                    </div>
                    <button className="rounded-lg bg-[#12331F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F3D2E]">
                      Upgrade
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-[#12331F]">
                    Payment Methods
                  </p>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-black/[0.06] p-4">
                    <div className="flex items-center gap-3">
                      <FiCreditCard className="text-[#12331F]/40" size={20} />
                      <span className="text-sm text-[#12331F]/70">
                        No payment method added
                      </span>
                    </div>
                    <button className="text-xs font-semibold text-[#12331F] underline">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save bar — shared across editable tabs */}
            {activeTab !== "billing" && (
              <div className="flex items-center justify-end gap-3 border-t border-black/[0.06] bg-[#FDFCF9] px-6 py-4 sm:px-8">
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#3D8B3D]">
                    <FiCheck size={14} /> Saved
                  </span>
                )}
                <button
                  onClick={handleSave}
                  className="rounded-xl bg-[#12331F] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0F3D2E]"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}