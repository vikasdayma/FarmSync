// "use client";

// import {
//   Landmark,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   IndianRupee,
//   CalendarClock,
//   FileText,
//   Percent,
//   Hash,
// } from "lucide-react";

// import type { Loan, LoanStatus } from "@/types/loans";

// export const statusConfig: Record <

//   LoanStatus,
//   { label: string; color: string; bg: string; ring: string; icon: React.ElementType }
// > = {
//   DRAFT: {
//     label: "Draft",
//     color: "text-gray-600",
//     bg: "bg-gray-100",
//     ring: "ring-gray-200",
//     icon: FileText,
//   },
//   SUBMITTED: {
//     label: "Submitted",
//     color: "text-amber-700",
//     bg: "bg-amber-100",
//     ring: "ring-amber-200",
//     icon: Clock,
//   },
//   UNDER_REVIEW: {
//     label: "Under Review",
//     color: "text-blue-700",
//     bg: "bg-blue-100",
//     ring: "ring-blue-200",
//     icon: AlertCircle,
//   },
//   APPROVED: {
//     label: "Approved",
//     color: "text-green-700",
//     bg: "bg-green-100",
//     ring: "ring-green-200",
//     icon: CheckCircle2,
//   },
//   REJECTED: {
//     label: "Rejected",
//     color: "text-red-700",
//     bg: "bg-red-100",
//     ring: "ring-red-200",
//     icon: XCircle,
//   },
//   DISBURSED: {
//     label: "Disbursed",
//     color: "text-emerald-700",
//     bg: "bg-emerald-100",
//     ring: "ring-emerald-200",
//     icon: CheckCircle2,
//   },
//   REPAID: {
//     label: "Repaid",
//     color: "text-teal-700",
//     bg: "bg-teal-100",
//     ring: "ring-teal-200",
//     icon: CheckCircle2,
//   },
//   DEFAULTED: {
//     label: "Defaulted",
//     color: "text-red-800",
//     bg: "bg-red-200",
//     ring: "ring-red-300",
//     icon: XCircle,
//   },
// };

// export default function LoanDetailsCard({ loan }: { loan: Loan }) {
//   if (!loan) return null;
//   const config = statusConfig[loan.status];
//   const StatusIcon = config.icon;

//   return (
//     <div className="w-full max-w-2xl mx-auto rounded-[28px] bg-white shadow-2xl shadow-black/[0.08] overflow-hidden ring-1 ring-black/[0.04]">
//       {/* Header banner */}
//       <div className="relative bg-gradient-to-br from-[#12331F] via-[#0F2318] to-[#0a1a10] px-8 py-9 sm:px-10 sm:py-10">
//         <div
//           className="pointer-events-none absolute inset-0 opacity-[0.07]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
//             backgroundSize: "22px 22px",
//           }}
//         />
//         <div className="relative flex items-start justify-between gap-4">
//           <div className="flex items-start gap-4">
//             <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4F26A]/15 ring-1 ring-[#D4F26A]/25">
//               <Landmark className="h-6 w-6 text-[#D4F26A]" />
//             </div>
//             <div>
//               <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
//                 Loan Application
//               </p>
//               <h2
//                 className="mt-1 text-2xl font-semibold text-white"
//                 style={{ fontFamily: "'Lora', serif" }}
//               >
//                 {loan.purpose.length > 34
//                   ? `${loan.purpose.slice(0, 34)}…`
//                   : loan.purpose}
//               </h2>
//               <div className="mt-2.5 flex items-center gap-1.5 text-xs text-white/40">
//                 <Hash className="h-3 w-3" />
//                 <span className="font-mono tracking-wide">
//                   {loan.appNo.slice(0, 8).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div
//             className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.bg} ${config.color} ${config.ring}`}
//           >
//             <StatusIcon className="h-3.5 w-3.5" />
//             {config.label}
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="px-8 py-8 sm:px-10 sm:py-9 space-y-8">
//         {/* Key stats grid */}
//         <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
//           <div className="rounded-2xl bg-[#FAFBF8] border border-black/[0.05] p-4">
//             <div className="flex items-center gap-1.5 text-[#12331F]/40">
//               <IndianRupee className="h-3.5 w-3.5" />
//               <p className="text-[11px] font-medium uppercase tracking-wide">
//                 Amount
//               </p>
//             </div>
//             <p className="mt-2 text-xl font-semibold text-[#12331F]">
//               ₹{Number(loan.loanAmount).toLocaleString("en-IN")}
//             </p>
//           </div>

//           <div className="rounded-2xl bg-[#FAFBF8] border border-black/[0.05] p-4">
//             <div className="flex items-center gap-1.5 text-[#12331F]/40">
//               <CalendarClock className="h-3.5 w-3.5" />
//               <p className="text-[11px] font-medium uppercase tracking-wide">
//                 Tenure
//               </p>
//             </div>
//             <p className="mt-2 text-xl font-semibold text-[#12331F]">
//               {loan.tenureMonths}
//               <span className="ml-1 text-sm font-normal text-[#12331F]/50">
//                 months
//               </span>
//             </p>
//           </div>

//           <div className="rounded-2xl bg-[#FAFBF8] border border-black/[0.05] p-4">
//             <div className="flex items-center gap-1.5 text-[#12331F]/40">
//               <Percent className="h-3.5 w-3.5" />
//               <p className="text-[11px] font-medium uppercase tracking-wide">
//                 Interest
//               </p>
//             </div>
//             <p className="mt-2 text-xl font-semibold text-[#12331F]">
//               {loan.interestRatePct}%
//             </p>
//           </div>
//         </div>

//         {/* Applied date */}
//         <div className="flex items-center justify-between border-y border-black/[0.06] py-4">
//           <span className="flex items-center gap-2 text-sm text-[#12331F]/50">
//             <CalendarClock className="h-4 w-4" />
//             Applied on
//           </span>
//           <span className="text-sm font-semibold text-[#12331F]">
//             {new Date(loan.createdAt).toLocaleDateString("en-IN", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             })}
//           </span>
//         </div>

//         {/* Purpose */}
//         <div>
//           <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40">
//             Purpose
//           </p>
//           <p className="mt-2 text-[15px] leading-relaxed text-[#12331F]/80">
//             {loan.purpose}
//           </p>
//         </div>

//         {/* Collateral, if present */}
//         {loan.collateralDetails && (
//           <div>
//             <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40">
//               Collateral Details
//             </p>
//             <p className="mt-2 text-[15px] leading-relaxed text-[#12331F]/80">
//               {loan.collateralDetails}
//             </p>
//           </div>
//         )}

//         {/* Rejection reason */}
//         {loan.status === "REJECTED" && loan.reviewNotes && (
//           <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
//             <p className="flex items-center gap-2 text-xs font-semibold text-red-700">
//               <XCircle className="h-3.5 w-3.5" />
//               Reason for rejection
//             </p>
//             <p className="mt-2 text-sm leading-relaxed text-red-600">
//               {loan.reviewNotes}
//             </p>
//           </div>
//         )}

//         {/* Approval note */}
//         {loan.status === "APPROVED" && loan.reviewNotes && (
//           <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
//             <p className="flex items-center gap-2 text-xs font-semibold text-green-700">
//               <CheckCircle2 className="h-3.5 w-3.5" />
//               Officer&apos;s note
//             </p>
//             <p className="mt-2 text-sm leading-relaxed text-green-700">
//               {loan.reviewNotes}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Landmark,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
  CalendarClock,
  FileText,
  Percent,
  Hash,
  Circle,
  Phone,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import type { Loan, LoanStatus } from "@/types/loans";

export const statusConfig: Record <
  LoanStatus,
  { label: string; color: string; bg: string; ring: string; icon: React.ElementType }
> = {
  DRAFT: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100", ring: "ring-gray-200", icon: FileText },
  SUBMITTED: { label: "Submitted", color: "text-amber-700", bg: "bg-amber-100", ring: "ring-amber-200", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "text-blue-700", bg: "bg-blue-100", ring: "ring-blue-200", icon: AlertCircle },
  APPROVED: { label: "Approved", color: "text-green-700", bg: "bg-green-100", ring: "ring-green-200", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "text-red-700", bg: "bg-red-100", ring: "ring-red-200", icon: XCircle },
  DISBURSED: { label: "Disbursed", color: "text-emerald-700", bg: "bg-emerald-100", ring: "ring-emerald-200", icon: CheckCircle2 },
  REPAID: { label: "Repaid", color: "text-teal-700", bg: "bg-teal-100", ring: "ring-teal-200", icon: CheckCircle2 },
  DEFAULTED: { label: "Defaulted", color: "text-red-800", bg: "bg-red-200", ring: "ring-red-300", icon: XCircle },
};

// Ordered pipeline used to build the timeline. REJECTED/DEFAULTED are terminal
// states handled separately since they branch off the happy path.
const PIPELINE: LoanStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "DISBURSED",
  "REPAID",
];

function getPipelineIndex(status: LoanStatus) {
  if (status === "REJECTED" || status === "DEFAULTED" || status === "DRAFT") return -1;
  return PIPELINE.indexOf(status);
}

export default function LoanDetailsCard({ loan }: { loan: Loan }) {
  if (!loan) return null;
  const config = statusConfig[loan.status];
  const StatusIcon = config.icon;
  const currentIndex = getPipelineIndex(loan.status);
  const isTerminalBad = loan.status === "REJECTED" || loan.status === "DEFAULTED";

  return (
    <div className="min-h-screen bg-[#e3f3e3] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* ============ LEFT: Main loan card ============ */}
        <div className="rounded-[28px] bg-white shadow-2xl shadow-black/[0.08] overflow-hidden ring-1 ring-black/[0.04]">
          {/* Header banner */}
          <div className="relative bg-gradient-to-br from-[#12331F] via-[#0F2318] to-[#0a1a10] px-8 py-9 sm:px-10 sm:py-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4F26A]/15 ring-1 ring-[#D4F26A]/25">
                  <Landmark className="h-6 w-6 text-[#D4F26A]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                    Loan Application
                  </p>
                  <h2
                    className="mt-1 text-2xl font-semibold text-white"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {loan.purpose.length > 34 ? `${loan.purpose.slice(0, 34)}…` : loan.purpose}
                  </h2>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-white/40">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono tracking-wide">
                      {loan.appNo.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ${config.bg} ${config.color} ${config.ring}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {config.label}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 sm:px-10 sm:py-9 space-y-8">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#FAFBF8] border border-black/[0.05] p-4">
                <div className="flex items-center gap-1.5 text-[#12331F]/40">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <p className="text-[11px] font-medium uppercase tracking-wide">Amount</p>
                </div>
                <p className="mt-2 text-xl font-semibold text-[#12331F]">
                  ₹{Number(loan.loanAmount).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAFBF8] border border-black/[0.05] p-4">
                <div className="flex items-center gap-1.5 text-[#12331F]/40">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <p className="text-[11px] font-medium uppercase tracking-wide">Tenure</p>
                </div>
                <p className="mt-2 text-xl font-semibold text-[#12331F]">
                  {loan.tenureMonths}
                  <span className="ml-1 text-sm font-normal text-[#12331F]/50">months</span>
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAFBF8] border border-black/[0.05] p-4">
                <div className="flex items-center gap-1.5 text-[#12331F]/40">
                  <Percent className="h-3.5 w-3.5" />
                  <p className="text-[11px] font-medium uppercase tracking-wide">Interest</p>
                </div>
                <p className="mt-2 text-xl font-semibold text-[#12331F]">
                  {loan.interestRatePct}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-y border-black/[0.06] py-4">
              <span className="flex items-center gap-2 text-sm text-[#12331F]/50">
                <CalendarClock className="h-4 w-4" />
                Applied on
              </span>
              <span className="text-sm font-semibold text-[#12331F]">
                {new Date(loan.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40">
                Purpose
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#12331F]/80">
                {loan.purpose}
              </p>
            </div>

            {loan.collateralDetails && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40">
                  Collateral Details
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[#12331F]/80">
                  {loan.collateralDetails}
                </p>
              </div>
            )}

            {loan.status === "REJECTED" && loan.reviewNotes && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-red-700">
                  <XCircle className="h-3.5 w-3.5" />
                  Reason for rejection
                </p>
                <p className="mt-2 text-sm leading-relaxed text-red-600">{loan.reviewNotes}</p>
              </div>
            )}

            {loan.status === "APPROVED" && loan.reviewNotes && (
              <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Officer&apos;s note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-green-700">{loan.reviewNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* ============ RIGHT: Sidebar ============ */}
        <div className="flex flex-col gap-6">
          {/* Status timeline */}
          <div className="rounded-[24px] bg-white shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40 mb-5">
              Application Progress
            </p>

            {isTerminalBad ? (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#12331F]">
                    {loan.status === "REJECTED" ? "Application rejected" : "Loan defaulted"}
                  </p>
                  <p className="mt-0.5 text-xs text-[#12331F]/50">
                    {loan.reviewedAt
                      ? new Date(loan.reviewedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            ) : (
              <ol className="relative space-y-6">
                {PIPELINE.map((step, i) => {
                  const stepConfig = statusConfig[step];
                  const StepIcon = stepConfig.icon;
                  const done = i <= currentIndex;
                  
                   const active = i === currentIndex+1;
             
                 
                  const upcoming = i > currentIndex;

                  return (
                    <li key={step} className="relative flex items-start gap-3.5">
                      {i !== PIPELINE.length - 1 && (
                        <span
                          className={`absolute left-[15px] top-8 h-[calc(100%+8px)] w-px ${
                            done ? "bg-[#12331F]/30" : "bg-black/[0.08]"
                          }`}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          done
                            ? "bg-[#12331F] text-[#D4F26A]"
                            : active
                            ? `${stepConfig.bg} ${stepConfig.color} ring-2 ring-offset-2 ring-[#12331F]/20`
                            : "bg-gray-50 text-gray-300"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : upcoming ? (
                          <Circle className="h-3.5 w-3.5" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="pt-1">
                        <p
                          className={`text-sm font-semibold ${
                            upcoming ? "text-[#12331F]/35" : "text-[#12331F]"
                          }`}
                        >
                          {stepConfig.label}
                        </p>
                        {active && (
                          <p className="mt-0.5 text-xs text-[#12331F]/50">In progress</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Documents checklist */}
          <div className="rounded-[24px] bg-white shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40 mb-4">
              Documents
            </p>
            {loan.documents && loan.documents.length > 0 ? (
              <ul className="space-y-2.5">
                {loan.documents.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl bg-[#FAFBF8] border border-black/[0.05] px-3.5 py-2.5"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-[#12331F]/40" />
                    <span className="truncate text-sm text-[#12331F]/70">
                      {doc.split("/").pop() ?? `Document ${i + 1}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#12331F]/40">No documents uploaded.</p>
            )}
          </div>

          {/* Support card */}
          <div className="rounded-[24px] bg-gradient-to-br from-[#12331F] to-[#0a1a10] p-6 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4F26A]/15 ring-1 ring-[#D4F26A]/25">
              <ShieldCheck className="h-5 w-5 text-[#D4F26A]" />
            </div>
            <p className="mt-4 text-sm font-semibold">Need help with your application?</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/50">
              Your local agronomist reviews every application and can answer questions
              about your loan status.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-xs font-medium text-white/80 hover:bg-white/10 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                Call support
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-xs font-medium text-white/80 hover:bg-white/10 transition-colors">
                <MessageCircle className="h-3.5 w-3.5" />
                Message agronomist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}