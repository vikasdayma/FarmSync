"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Landmark,
  Target,
  CalendarClock,
  Percent,
  ShieldCheck,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";

// Zod validation schema
const loanSchema = z.object({
  loanAmount: z.number().min(1000, "Minimum loan amount is 1000"),
  purpose: z.string().min(5, "Purpose must be at least 5 characters"),
  tenureMonths: z
    .number()
    .min(1, "Minimum 1 month")
    .max(360, "Maximum 360 months"),
  interestRatePct: z
    .number()
    .min(1, "Minimum 1%")
    .max(50, "Maximum 50%")
    .optional(),
  collateralDetails: z.string().optional(),
  documents: z.array(z.instanceof(File)).optional(),
});

type LoanFormData = z.infer<typeof loanSchema>;

const Loan = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
  });

  const watchedFiles = watch("documents");

  const onSubmit = async (data: LoanFormData) => {
    try {
      const formData = new FormData();
      formData.append("loanAmount", data.loanAmount.toString());
      formData.append("purpose", data.purpose);
      formData.append("tenureMonths", data.tenureMonths.toString());

      if (data.interestRatePct) {
        formData.append("interestRatePct", data.interestRatePct.toString());
      }
      if (data.collateralDetails) {
        formData.append("collateralDetails", data.collateralDetails);
      }
      if (data.documents?.length) {
        data.documents.forEach((file) => {
          formData.append("documents", file);
        });
      }

      const response = await fetch("/api/loans", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" bg-[#e3f3e3] flex items-start justify-center p-4 sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/[0.06]"
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#12331F] to-[#0F2318] px-8 py-8 text-white">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4F26A]/15">
            <Landmark className="h-5 w-5 text-[#D4F26A]" />
          </div>
          <h1
            className="text-[26px] font-semibold leading-tight"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Loan Application
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            Tell us what you need and we&apos;ll match you with the right terms.
          </p>
        </div>

        <div className="space-y-8 px-8 py-8">
          {/* Section: Loan Details */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#12331F]/40">
              Loan Details
            </p>

            <div className="space-y-5">
              {/* Loan Amount */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                  <Target className="h-3.5 w-3.5 text-[#12331F]/40" />
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#12331F]/40">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="50,000"
                    className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-8 pr-4 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                    {...register("loanAmount", { valueAsNumber: true })}
                  />
                </div>
                {errors.loanAmount && (
                  <p className="text-xs text-red-500">
                    {errors.loanAmount.message}
                  </p>
                )}
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#12331F]">
                  Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Purchasing irrigation equipment"
                  className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                  {...register("purpose")}
                />
                {errors.purpose && (
                  <p className="text-xs text-red-500">
                    {errors.purpose.message}
                  </p>
                )}
              </div>

              {/* Tenure + Interest — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                    <CalendarClock className="h-3.5 w-3.5 text-[#12331F]/40" />
                    Tenure
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="12"
                      className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-4 pr-14 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                      {...register("tenureMonths", { valueAsNumber: true })}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#12331F]/35">
                      months
                    </span>
                  </div>
                  {errors.tenureMonths && (
                    <p className="text-xs text-red-500">
                      {errors.tenureMonths.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                    <Percent className="h-3.5 w-3.5 text-[#12331F]/40" />
                    Interest Rate
                    <span className="text-[11px] font-normal text-[#12331F]/35">
                      optional
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="8.5"
                      className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-4 pr-8 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                      {...register("interestRatePct", { valueAsNumber: true })}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#12331F]/35">
                      %
                    </span>
                  </div>
                  {errors.interestRatePct && (
                    <p className="text-xs text-red-500">
                      {errors.interestRatePct.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-black/[0.06]" />

          {/* Section: Collateral & Documents */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#12331F]/40">
              Collateral &amp; Documents
            </p>

            <div className="space-y-5">
              {/* Collateral */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#12331F]/40" />
                  Collateral Details
                  <span className="text-[11px] font-normal text-[#12331F]/35">
                    optional
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe any land, equipment, or assets offered as collateral..."
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#FAFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                  {...register("collateralDetails")}
                />
                {errors.collateralDetails && (
                  <p className="text-xs text-red-500">
                    {errors.collateralDetails.message}
                  </p>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                  <FileText className="h-3.5 w-3.5 text-[#12331F]/40" />
                  Supporting Documents
                  <span className="text-[11px] font-normal text-[#12331F]/35">
                    optional
                  </span>
                </label>

                <label
                  htmlFor="documents"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#FAFBF8] px-4 py-8 text-center transition hover:border-[#6FA35A]/50 hover:bg-[#6FA35A]/[0.03]"
                >
                  <UploadCloud className="h-6 w-6 text-[#12331F]/30" />
                  <span className="text-sm text-[#12331F]/60">
                    <span className="font-medium text-[#3F7A3E]">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </span>
                  <span className="text-[11px] text-[#12331F]/35">
                    PDF, JPG, PNG up to 10MB each
                  </span>
                  <input
                    id="documents"
                    type="file"
                    multiple
                    className="hidden"
                    {...register("documents", {
                      setValueAs: (value) => Array.from(value || []),
                    })}
                  />
                </label>

                {watchedFiles && watchedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {Array.from(watchedFiles).map((file: File, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-[#6FA35A]/[0.06] px-3 py-2 text-xs text-[#12331F]/70"
                      >
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 shrink-0 text-[#12331F]/35">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#12331F] py-3.5 font-medium text-white shadow-md shadow-[#12331F]/20 transition-all duration-200 hover:bg-[#0F2318] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-center text-[11px] text-[#12331F]/35">
            Your details are encrypted and reviewed within 2–3 business days.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Loan;