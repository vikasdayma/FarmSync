"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod validation schema
const loanSchema = z.object({
  loanAmount: z
    .number()
    .min(1000, "Minimum loan amount is 1000"),

  purpose: z
    .string()
    .min(5, "Purpose must be at least 5 characters"),

  tenureMonths: z
    .number()
    .min(1, "Minimum 1 month")
    .max(360, "Maximum 360 months"),

  interestRatePct: z
    .number()
    .min(1, "Minimum 1%")
    .max(50, "Maximum 50%")
    .optional(),

  collateralDetails: z
    .string()
    .optional(),

  documents: z
    .array(z.instanceof(File))
    .optional(),
});

// TypeScript type from schema
type LoanFormData = z.infer<typeof loanSchema>;

const Loan = () => {

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
  });

  // Submit function
  const onSubmit = async (data: LoanFormData) => {
    try {

      // FormData for file uploads
      const formData = new FormData();

      formData.append(
        "loanAmount",
        data.loanAmount.toString()
      );

      formData.append(
        "purpose",
        data.purpose
      );

      formData.append(
        "tenureMonths",
        data.tenureMonths.toString()
      );

      if (data.interestRatePct) {
        formData.append(
          "interestRatePct",
          data.interestRatePct.toString()
        );
      }

      if (data.collateralDetails) {
        formData.append(
          "collateralDetails",
          data.collateralDetails
        );
      }

      // Append files
      if (data.documents?.length) {
        data.documents.forEach((file) => {
          formData.append("documents", file);
        });
      }

      const response = await fetch("/api/loansc", {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Loan Application
          </h1>

          <p className="text-gray-500 mt-2">
            Fill in the details to apply for a loan
          </p>
        </div>

        {/* Loan Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Loan Amount
          </label>

          <input
            type="number"
            placeholder="Enter loan amount"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            {...register("loanAmount", {
              valueAsNumber: true,
            })}
          />

          {errors.loanAmount && (
            <p className="text-red-500 text-sm">
              {errors.loanAmount.message}
            </p>
          )}
        </div>

        {/* Purpose */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Purpose
          </label>

          <input
            type="text"
            placeholder="Loan purpose"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            {...register("purpose")}
          />

          {errors.purpose && (
            <p className="text-red-500 text-sm">
              {errors.purpose.message}
            </p>
          )}
        </div>

        {/* Tenure */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tenure Months
          </label>

          <input
            type="number"
            placeholder="Enter tenure"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            {...register("tenureMonths", {
              valueAsNumber: true,
            })}
          />

          {errors.tenureMonths && (
            <p className="text-red-500 text-sm">
              {errors.tenureMonths.message}
            </p>
          )}
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Interest Rate %
          </label>

          <input
            type="number"
            placeholder="Interest rate"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            {...register("interestRatePct", {
              valueAsNumber: true,
            })}
          />

          {errors.interestRatePct && (
            <p className="text-red-500 text-sm">
              {errors.interestRatePct.message}
            </p>
          )}
        </div>

        {/* Collateral */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Collateral Details
          </label>

          <textarea
            rows={4}
            placeholder="Write collateral details..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black resize-none"
            {...register("collateralDetails")}
          />

          {errors.collateralDetails && (
            <p className="text-red-500 text-sm">
              {errors.collateralDetails.message}
            </p>
          )}
        </div>

        {/* Documents */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Upload Documents
          </label>

          <input
            type="file"
            multiple
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
            {...register("documents", {
              setValueAs: (value) =>
                Array.from(value || []),
            })}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Submit Loan
        </button>

      </form>
    </div>
  );
};

export default Loan;