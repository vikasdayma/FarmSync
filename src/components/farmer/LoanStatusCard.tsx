"use client";

import {
  Landmark,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  CalendarClock,
  Hash,
  Percent,
  LifeBuoy,
  ListChecks,
} from "lucide-react";

import LoanDetailsCard, { statusConfig } from "./AlreadyAppliedLoan";
import { Loan } from "@/generated/prisma/client";
import { serializeLoan } from "../../../app/api/loans/route"; 
const STEPS: { key: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "DISBURSED"; label: string }[] = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "APPROVED", label: "Approved" },
  { key: "DISBURSED", label: "Disbursed" },
];


function getStepIndex(status: Loan["status"]): number {
  switch (status) {
    case "DRAFT":
      return -1;
    case "SUBMITTED":
      return 0;
    case "UNDER_REVIEW":
      return 1;
    case "APPROVED":
      return 2;
    case "DISBURSED":
    case "REPAID":
    case "DEFAULTED":
      return 3;
    case "REJECTED":
      // Rejection can happen at submission or during review; either way,
      // treat "Under Review" as the last step reached before it stopped.
      return 1;
    default:
      return -1;
  }
}

export default function LoanStatusPage({ data }: { data: Loan[] }) {
  const loan = data[0]; // most recent application
  
  const config = statusConfig[loan.status];
  const StatusIcon = config.icon;
  const isRejected = loan.status === "REJECTED";
  const currentStep = getStepIndex(loan.status);
  const serializedLoan = serializeLoan(loan);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FFF6] via-[#F3FBF1] to-[#EEF8EA] pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#12331F] to-[#0F2318] px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4F26A]/15">
              <Landmark className="h-5 w-5 text-[#D4F26A]" />
            </div>
            <h1
              className="text-[26px] font-semibold leading-tight text-white sm:text-[30px]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Loan Application Status
            </h1>
            <p className="mt-1.5 text-sm text-white/60">
              Track your loan application and latest updates.
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${config.bg} ${config.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            {config.label}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Progress tracker */}
        <div className="-mt-6 rounded-3xl bg-white p-6 shadow-xl shadow-black/[0.06] sm:p-8">
          {isRejected ? (
            <div className="flex items-center gap-3 text-sm text-red-600">
              <XCircle className="h-5 w-5 shrink-0" />
              <span>
                This application was rejected during{" "}
                {currentStep === 0 ? "submission" : "review"}.
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              {STEPS.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isLast = index === STEPS.length - 1;
                return (
                  <div key={step.key} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                          isCompleted
                            ? "border-[#6FA35A] bg-[#6FA35A] text-white"
                            : "border-black/10 bg-white text-[#12331F]/30"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>
                      <span
                        className={`whitespace-nowrap text-[11px] font-medium sm:text-xs ${
                          isCompleted ? "text-[#12331F]" : "text-[#12331F]/40"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`mx-2 h-[2px] flex-1 rounded-full sm:mx-3 ${
                          index < currentStep ? "bg-[#6FA35A]" : "bg-black/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={IndianRupee}
            label="Loan Amount"
            value={`₹${Number(loan.loanAmount).toLocaleString("en-IN")}`}
          />
          <StatCard icon={CalendarClock} label="Tenure" value={`${loan.tenureMonths} months`} />
          <StatCard icon={Percent} label="Interest Rate" value={`${loan.interestRatePct}%`} />
          <StatCard
            icon={Hash}
            label="Application No."
            value={loan.appNo.slice(0, 8).toUpperCase()}
          />
        </div>

        {/* Main content grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            
            <LoanDetailsCard loan={serializedLoan} />
          </div>

          <div className="space-y-6">
            <ActivityTimeline loan={loan} />
            <WhatsNextCard isRejected={isRejected} />
            <SupportCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-xl shadow-black/[0.06]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#12331F]/[0.06]">
        <Icon className="h-4 w-4 text-[#12331F]" />
      </div>
      <p className="text-[11px] text-[#12331F]/40">{label}</p>
      <p className="mt-0.5 truncate text-[15px] font-semibold text-[#12331F]">{value}</p>
    </div>
  );
}

function ActivityTimeline({ loan }: { loan: Loan }) {
  const appliedDate = new Date(loan.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const events: { title: string; date: string; note: string; done: boolean }[] = [
    {
      title: "Application Submitted",
      date: appliedDate,
      note: "Your application was received successfully.",
      done: true,
    },
    {
      title: loan.status === "REJECTED" ? "Application Rejected" : "Under Review",
      date: loan.status === "DRAFT" ? "Pending" : appliedDate,
      note:
        loan.status === "REJECTED"
          ? loan.reviewNotes ?? "The bank did not approve this application."
          : "Waiting for bank review.",
      done: loan.status !== "DRAFT" && loan.status !== "SUBMITTED",
    },
    {
      title: "Approved & Disbursed",
      date: loan.status === "DISBURSED" || loan.status === "REPAID" ? appliedDate : "Pending",
      note: "Funds will be transferred to your linked account.",
      done: loan.status === "DISBURSED" || loan.status === "REPAID",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-black/[0.06]">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12331F]/[0.06]">
          <Clock className="h-4 w-4 text-[#12331F]" />
        </div>
        <h2 className="text-[15px] font-semibold text-[#12331F]">Recent Activity</h2>
      </div>

      <div className="space-y-5">
        {events.map((event, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  event.done ? "bg-[#6FA35A] text-white" : "bg-black/5 text-[#12331F]/30"
                }`}
              >
                {event.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              {index !== events.length - 1 && (
                <div className="mt-1 h-full w-[2px] flex-1 bg-black/5" />
              )}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-[#12331F]">{event.title}</p>
              <p className="text-[11px] text-[#12331F]/40">{event.date}</p>
              <p className="mt-1 text-xs text-[#12331F]/60">{event.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsNextCard({ isRejected }: { isRejected: boolean }) {
  const items = isRejected
    ? [
        "Contact support to understand the rejection reason.",
        "Resolve any flagged issues before reapplying.",
        "You'll be able to submit a new application once cleared.",
      ]
    : [
        "Documents will be reviewed by our team.",
        "Bank may contact you for verification.",
        "You'll receive SMS & Email updates at every step.",
        "Approval usually takes 5–7 working days.",
      ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-black/[0.06]">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12331F]/[0.06]">
          <ListChecks className="h-4 w-4 text-[#12331F]" />
        </div>
        <h2 className="text-[15px] font-semibold text-[#12331F]">What&apos;s Next</h2>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-[#12331F]/70">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6FA35A]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SupportCard() {
  return (
    <div className="rounded-3xl bg-[#12331F] p-6 shadow-xl shadow-black/[0.06]">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4F26A]/15">
        <LifeBuoy className="h-4 w-4 text-[#D4F26A]" />
      </div>
      <h2 className="text-[15px] font-semibold text-white">Need Help?</h2>
      <p className="mt-1 text-xs text-white/60">
        Our support team can answer questions about your application.
      </p>
      <button className="mt-4 w-full rounded-xl bg-[#D4F26A] px-4 py-2.5 text-sm font-semibold text-[#12331F] transition-colors hover:bg-[#D4F26A]/90">
        Contact Support
      </button>
    </div>
  );
}