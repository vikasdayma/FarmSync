"use client";

import { useAuth } from "@/context/AuthProvider";
import { useGetCrops } from "@/hooks/useGetCrops";
import useLoanHook from "@/hooks/useLoanHook";
import {
  Sprout,
  ClipboardCheck,
  AlertTriangle,
  CalendarDays,
  MapPin,
  ChevronRight,
  Bell,
  FlaskConical,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";



const reviewQueue = [
  { id: 1, farmer: "Ramesh Patidar", farm: "Patidar Farm, Dhar", type: "Soil Report", submitted: "2 hours ago", priority: "high" },
  { id: 2, farmer: "Sunita Verma", farm: "Verma Agro, Mhow", type: "Crop Health Query", submitted: "5 hours ago", priority: "high" },
  { id: 3, farmer: "Anil Chouhan", farm: "Chouhan Fields, Dhar", type: "Irrigation Advisory", submitted: "Yesterday", priority: "medium" },
  { id: 4, farmer: "Meera Joshi", farm: "Joshi Orchards, Indore", type: "Soil Report", submitted: "Yesterday", priority: "low" },
];

const schedule = [
  { time: "10:00", farm: "Patidar Farm", task: "Soil sampling visit" },
  { time: "13:30", farm: "Chouhan Fields", task: "Irrigation system check" },
  { time: "16:00", farm: "Remote review", task: "Verma Agro consultation call" },
];

const farms = [
  { name: "Patidar Farm", location: "Dhar", crop: "Soybean", health: 82, trend: "up" },
  { name: "Verma Agro", location: "Mhow", crop: "Wheat", health: 58, trend: "down" },
  { name: "Chouhan Fields", location: "Dhar", crop: "Cotton", health: 91, trend: "up" },
  { name: "Joshi Orchards", location: "Indore", crop: "Mango", health: 74, trend: "flat" },
  { name: "Rathore Farms", location: "Dhar", crop: "Soybean", health: 45, trend: "down" },
];



const mono = { fontFamily: "ui-monospace, 'SF Mono', 'JetBrains Mono', monospace" };

export default function AgronomistDashboard() {
  const { user, isLoading } = useAuth();
  const {loading,data,error}=useLoanHook();
  const {loading:LoadingCrops,error:ErrorCrops,crops}=useGetCrops();
console.log(crops)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e3f3e3]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2B2620]/15 border-t-[#B5502E]" />
          <p className="text-sm font-light uppercase tracking-widest text-[#2B2620]/40">
            Loading…
          </p>
        </div>
      </div>
    );
  }
  if(error){
    return <h1>{error}</h1>
  }
const stats = [
  { label: "Farms Supervised", value: "0", icon: Sprout, trend: "+2 this month", stripe: "bg-[#7C8A6E]" },
  {
    label: "Pending Loan Application",
    value: loading ? "..." : data.filter((l) => l.status === "SUBMITTED").length,
    icon: ClipboardCheck,
    trend: "3 urgent",
    stripe: "bg-[#B5502E]",
    urgent: true,
  },
  { label: "Crops Listed",
         value: loading ? "..." :crops.length,
      icon: AlertTriangle, 
      trend: "Needs attention",
       stripe: "bg-[#A63B32]", 
       urgent: true },
  { label: "Visits This Week", value: "0", icon: CalendarDays, trend: "2 scheduled today", stripe: "bg-[#7C8A6E]" },
];
  return (
    <div className="min-h-screen bg-[#e3f3e3] p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#2B2620]/10 pb-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#B5502E]">
              Field Console · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="mt-1.5 text-[26px] font-semibold text-[#2B2620]">
              Good morning, Dr.{" "}
              {user?.firstName &&
                user.firstName.charAt(0).toUpperCase() +
                  user.firstName.slice(1).toLowerCase()}
            </h1>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#2B2620]/10 bg-white transition hover:border-[#2B2620]/25">
            <Bell className="h-[17px] w-[17px] text-[#2B2620]/60" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#B5502E]" />
          </button>
        </div>

        {/* Stat cards — accent stripe on top edge instead of icon badge */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, trend, urgent, stripe }) => (
            <div
              key={label}
              className="overflow-hidden rounded-lg border
               border-[#2B2620]/[0.08] bg-white shadow-sm  shadow-green-500"
            >
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-[#2B2620]/35" />
                  {urgent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A63B32]" />
                  )}
                </div>
                <p
                  className="mt-3 text-[26px] font-semibold leading-none text-[#2B2620]"
                  style={mono}
                >
                  {value}
                </p>
                <p className="mt-2 text-[12px] text-[#2B2620]/45">{label}</p>
                <p
                  className={`mt-1 text-[11px] font-medium ${
                    urgent ? "text-[#A63B32]" : "text-[#5C6B4E]"
                  }`}
                >
                  {trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Review queue */}
          <div className="lg:col-span-2 rounded-lg border border-[#2B2620]/[0.08] bg-white p-6">
            <div className="mb-5 flex items-center justify-between border-b border-[#2B2620]/[0.06] pb-4">
              <div>
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#2B2620]">
                  Needs Your Review
                </h2>
                <p className="mt-0.5 text-[12px] text-[#2B2620]/40">
                  Sorted by priority
                </p>
              </div>
              <button className="text-[12px] font-medium text-[#B5502E] hover:underline">
                View all →
              </button>
            </div>

            <div className="space-y-1">
              {/* {reviewQueue.map((item) => (
                <div
                  key={item.id}
                  className="group   flex items-center justify-between border-b border-[#2B2620]/[0.05] py-3.5 last:border-0 transition hover:bg-[#B5502E]/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#2B2620]/[0.04]">
                      {item.type === "Soil Report" ? (
                        <FlaskConical className="h-3.5 w-3.5 text-[#2B2620]/45" />
                      ) : (
                        <MessageSquare className="h-3.5 w-3.5 text-[#2B2620]/45" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium text-[#2B2620]">
                        {item.farmer}
                        <span className="font-normal text-[#2B2620]/40">
                          {" "}
                          · {item.type}
                        </span>
                      </p>
                      <p className="truncate text-[11.5px] text-[#2B2620]/38">
                        {item.farm} · {item.submitted}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span
                      className={`rounded border px-2 py-[3px] text-[10px] font-medium uppercase tracking-wide ${
                        priorityStyle[item.priority as keyof typeof priorityStyle]
                      }`}
                    >
                      {item.priority}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#2B2620]/20 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))} */}
         <h1 className="text-center mt-20 text-gray-400">  No Data Yet</h1>    
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-lg border border-[#2B2620]/[0.08] bg-white p-6">
            <h2 className="mb-5 border-b border-[#2B2620]/[0.06] pb-4 text-[13px] font-semibold uppercase tracking-wide text-[#2B2620]">
              Today&apos;s Schedule
            </h2>

            <div className="space-y-4">
              {/* {schedule.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span
                    className="w-11 shrink-0 pt-0.5 text-[12px] font-medium text-[#B5502E]"
                    style={mono}
                  >
                    {item.time}
                  </span>
                  <div className="border-l border-[#2B2620]/10 pb-1 pl-3">
                    <p className="text-[13px] font-medium text-[#2B2620]">
                      {item.task}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-[#2B2620]/40">
                      <MapPin className="h-3 w-3" />
                      {item.farm}
                    </p>
                  </div>
                </div>
              ))} */}
   <h1 className="text-center mt-20 text-gray-400">  No Data Yet</h1>    
            </div>

            <button className="mt-5 w-full rounded-md border border-dashed border-[#2B2620]/15 py-2.5 text-[12px] font-medium text-[#2B2620]/50 transition hover:border-[#B5502E]/40 hover:text-[#B5502E]">
              + Schedule a visit
            </button>
          </div>
        </div>

        {/* Farm table */}
        <div className="mt-5 rounded-lg border border-[#2B2620]/[0.08] bg-white p-6">
          <div className="mb-5 flex items-center justify-between border-b border-[#2B2620]/[0.06] pb-4">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[#2B2620]">
              Farms Under Supervision
            </h2>
            <button className="text-[12px] font-medium text-[#B5502E] hover:underline">
              View all →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="text-[10.5px] uppercase tracking-wide text-[#2B2620]/35">
                  <th className="pb-3 font-medium">Farm</th>
                  <th className="pb-3 font-medium">Crop</th>
                  <th className="pb-3 font-medium">Health Score</th>
                  <th className="pb-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {/* { farms.map((farm, i) => {
                  const colors = healthColor(farm.health);
                  return (
                    <tr
                      key={farm.name}
                      className={i % 2 === 1 ? "bg-[#2B2620]/[0.015]" : ""}
                    >
                      <td className="py-3 px-2">
                        <p className="text-[13px] font-medium text-[#2B2620]">
                          {farm.name}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-[#2B2620]/40">
                          <MapPin className="h-3 w-3" />
                          {farm.location}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-[12.5px] text-[#2B2620]/55">
                        {farm.crop}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-1 w-24 overflow-hidden rounded-full bg-black/[0.06]">
                            <div
                              className={`h-full rounded-full ${colors.bar}`}
                              style={{ width: `${farm.health}%` }}
                            />
                          </div>
                          <span
                            className={`text-[12px] font-medium ${colors.text}`}
                            style={mono}
                          >
                            {farm.health}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {farm.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-[#5C6B4E]" />}
                        {farm.trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-[#A63B32]" />}
                        {farm.trend === "flat" && <Minus className="h-3.5 w-3.5 text-[#2B2620]/25" />}
                      </td>
                    </tr>
                  );
                })} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}