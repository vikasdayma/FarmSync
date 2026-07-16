
// "use client";
// import React, { useState } from "react";
// import {
//   Landmark,
//   Target,
//   CalendarClock,
//   Percent,
//   ShieldCheck,
//   FileText,
//   UploadCloud,
// } from "lucide-react";



  
  
// interface LoanPageProps {
//   onLoanCreated: () => void;
// }


// const LoanPage = ({ onLoanCreated }: LoanPageProps) => {

//     const [formData, setFormData] = useState({
//     loanAmount: "",
//     purpose: "",
//     tenureMonths: "",
//     interestRatePct: "",
//     collateralDetails: "",
//   });
//   const [documents, setDocuments] = useState<File[]>([]);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);


//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     if (e.target.files) {
//       setDocuments(Array.from(e.target.files));
//     }
//   }

//   function validate() {
//     const newErrors: Record<string, string> = {};

//     const amount = Number(formData.loanAmount);
//     if (!formData.loanAmount || amount < 1000) {
//       newErrors.loanAmount = "Minimum loan amount is 1000";
//     }

//     if (!formData.purpose || formData.purpose.length < 5) {
//       newErrors.purpose = "Purpose must be at least 5 characters";
//     }

//     const tenure = Number(formData.tenureMonths);
//     if (!formData.tenureMonths || tenure < 1 || tenure > 360) {
//       newErrors.tenureMonths = "Tenure must be between 1 and 360 months";
//     }

//     if (formData.interestRatePct) {
//       const rate = Number(formData.interestRatePct);
//       if (rate < 1 || rate > 50) {
//         newErrors.interestRatePct = "Interest rate must be between 1 and 50";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
    

//     if (!validate()) {
//       console.log("VALIDATION FAILED", errors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
        
//       const payload = new FormData();
//       payload.append("loanAmount", formData.loanAmount);
//       payload.append("purpose", formData.purpose);
//       payload.append("tenureMonths", formData.tenureMonths);

//       if (formData.interestRatePct) {
//         payload.append("interestRatePct", formData.interestRatePct);
//       }
//       if (formData.collateralDetails) {
//         payload.append("collateralDetails", formData.collateralDetails);
//       }
//       documents.forEach((file) => payload.append("documents", file));

//       const response = await fetch("/api/loans", {
//         method: "POST",
//         body: payload,
//       });

//       const result = await response.json();
//       console.log("RESPONSE:", result);

//       if (!response.ok) {
//         console.log("API ERROR:", result);
//         return;
//       }


//       setFormData({
//         loanAmount: "",
//         purpose: "",
//         tenureMonths: "",
//         interestRatePct: "",
//         collateralDetails: "",
//       });

   
//      onLoanCreated();

//       setDocuments([]);
//     } catch (error) {
//       console.log("FETCH ERROR:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//    <div className="bg-[#e3f3e3] flex items-start justify-center p-4 sm:p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/[0.06]"
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-b from-[#12331F] to-[#0F2318] px-8 py-8 text-white">
//           <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4F26A]/15">
//             <Landmark className="h-5 w-5 text-[#D4F26A]" />
//           </div>
//           <h1
//             className="text-[26px] font-semibold leading-tight"
//             style={{ fontFamily: "'Lora', serif" }}
//           >
//             Loan Application
//           </h1>
//           <p className="mt-1.5 text-sm text-white/60">
//             Tell us what you need and we&apos;ll match you with the right terms.
//           </p>
//         </div>

//         <div className="space-y-8 px-8 py-8">
//           {/* Loan Details */}
//           <div>
//             <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#12331F]/40">
//               Loan Details
//             </p>

//             <div className="space-y-5">
//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
//                   <Target className="h-3.5 w-3.5 text-[#12331F]/40" />
//                   Loan Amount
//                 </label>
//                 <div className="relative">
//                   <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#12331F]/40">
//                     ₹
//                   </span>
//                   <input
//                     type="number"
//                     name="loanAmount"
//                     value={formData.loanAmount}
//                     onChange={handleChange}
//                     placeholder="50,000"
//                     className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-8 pr-4 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
//                   />
//                 </div>
//                 {errors.loanAmount && (
//                   <p className="text-xs text-red-500">{errors.loanAmount}</p>
//                 )}
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-[#12331F]">
//                   Purpose
//                 </label>
//                 <input
//                   type="text"
//                   name="purpose"
//                   value={formData.purpose}
//                   onChange={handleChange}
//                   placeholder="e.g. Purchasing irrigation equipment"
//                   className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
//                 />
//                 {errors.purpose && (
//                   <p className="text-xs text-red-500">{errors.purpose}</p>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
//                     <CalendarClock className="h-3.5 w-3.5 text-[#12331F]/40" />
//                     Tenure
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="tenureMonths"
//                       value={formData.tenureMonths}
//                       onChange={handleChange}
//                       placeholder="12"
//                       className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-4 pr-14 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
//                     />
//                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#12331F]/35">
//                       months
//                     </span>
//                   </div>
//                   {errors.tenureMonths && (
//                     <p className="text-xs text-red-500">
//                       {errors.tenureMonths}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
//                     <Percent className="h-3.5 w-3.5 text-[#12331F]/40" />
//                     Interest Rate
//                     <span className="text-[11px] font-normal text-[#12331F]/35">
//                       optional
//                     </span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="interestRatePct"
//                       value={formData.interestRatePct}
//                       onChange={handleChange}
//                       placeholder="8.5"
//                       className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-4 pr-8 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
//                     />
//                     <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#12331F]/35">
//                       %
//                     </span>
//                   </div>
//                   {errors.interestRatePct && (
//                     <p className="text-xs text-red-500">
//                       {errors.interestRatePct}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="h-px bg-black/[0.06]" />

//           {/* Collateral & Documents */}
//           <div>
//             <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#12331F]/40">
//               Collateral &amp; Documents
//             </p>

//             <div className="space-y-5">
//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
//                   <ShieldCheck className="h-3.5 w-3.5 text-[#12331F]/40" />
//                   Collateral Details
//                   <span className="text-[11px] font-normal text-[#12331F]/35">
//                     optional
//                   </span>
//                 </label>
//                 <textarea
//                   name="collateralDetails"
//                   value={formData.collateralDetails}
//                   onChange={handleChange}
//                   rows={3}
//                   placeholder="Describe any land, equipment, or assets offered as collateral..."
//                   className="w-full resize-none rounded-xl border border-black/10 bg-[#FAFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
//                   <FileText className="h-3.5 w-3.5 text-[#12331F]/40" />
//                   Supporting Documents
//                   <span className="text-[11px] font-normal text-[#12331F]/35">
//                     optional
//                   </span>
//                 </label>

//                 <label
//                   htmlFor="documents"
//                   className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#FAFBF8] px-4 py-8 text-center transition hover:border-[#6FA35A]/50 hover:bg-[#6FA35A]/[0.03]"
//                 >
//                   <UploadCloud className="h-6 w-6 text-[#12331F]/30" />
//                   <span className="text-sm text-[#12331F]/60">
//                     <span className="font-medium text-[#3F7A3E]">
//                       Click to upload
//                     </span>{" "}
//                     or drag and drop
//                   </span>
//                   <span className="text-[11px] text-[#12331F]/35">
//                     PDF, JPG, PNG up to 10MB each
//                   </span>
//                   <input
//                     id="documents"
//                     type="file"
//                     multiple
//                     className="hidden"
//                     onChange={handleFileChange}
//                   />
//                 </label>

//                 {documents.length > 0 && (
//                   <div className="mt-2 space-y-1.5">
//                     {documents.map((file, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center justify-between rounded-lg bg-[#6FA35A]/[0.06] px-3 py-2 text-xs text-[#12331F]/70"
//                       >
//                         <span className="truncate">{file.name}</span>
//                         <span className="ml-2 shrink-0 text-[#12331F]/35">
//                           {(file.size / 1024).toFixed(0)} KB
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full rounded-xl bg-[#12331F] py-3.5 font-medium text-white shadow-md shadow-[#12331F]/20 transition-all duration-200 hover:bg-[#0F2318] active:scale-[0.99] disabled:opacity-50"
//           >
//             {isSubmitting ? "Submitting..." : "Submit Application"}
//           </button>

//           <p className="text-center text-[11px] text-[#12331F]/35">
//             Your details are encrypted and reviewed within 2–3 business days.
//           </p>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default LoanPage


"use client";
import React, { useState } from "react";
import {
  Landmark,
  Target,
  CalendarClock,
  Percent,
  ShieldCheck,
  FileText,
  UploadCloud,
  ClipboardCheck,
  Search,
  Banknote,
  CheckCircle2,
  Sprout,
  Clock3,
} from "lucide-react";

interface LoanPageProps {
  onLoanCreated: () => void;
}

const PROCESS_STEPS = [
  {
    icon: ClipboardCheck,
    title: "Submit application",
    desc: "Fill in your loan details and upload any supporting documents.",
  },
  {
    icon: Search,
    title: "Agronomist review",
    desc: "A local agronomist verifies your purpose and collateral details.",
  },
  {
    icon: Banknote,
    title: "Funds disbursed",
    desc: "Once approved, funds are released directly to your account.",
  },
];

const LoanPage = ({ onLoanCreated }: LoanPageProps) => {
  const [formData, setFormData] = useState({
    loanAmount: "",
    purpose: "",
    tenureMonths: "",
    interestRatePct: "",
    collateralDetails: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    const amount = Number(formData.loanAmount);
    if (!formData.loanAmount || amount < 1000) {
      newErrors.loanAmount = "Minimum loan amount is 1000";
    }

    if (!formData.purpose || formData.purpose.length < 5) {
      newErrors.purpose = "Purpose must be at least 5 characters";
    }

    const tenure = Number(formData.tenureMonths);
    if (!formData.tenureMonths || tenure < 1 || tenure > 360) {
      newErrors.tenureMonths = "Tenure must be between 1 and 360 months";
    }

    if (formData.interestRatePct) {
      const rate = Number(formData.interestRatePct);
      if (rate < 1 || rate > 50) {
        newErrors.interestRatePct = "Interest rate must be between 1 and 50";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validate()) {
      console.log("VALIDATION FAILED", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("loanAmount", formData.loanAmount);
      payload.append("purpose", formData.purpose);
      payload.append("tenureMonths", formData.tenureMonths);

      if (formData.interestRatePct) {
        payload.append("interestRatePct", formData.interestRatePct);
      }
      if (formData.collateralDetails) {
        payload.append("collateralDetails", formData.collateralDetails);
      }
      documents.forEach((file) => payload.append("documents", file));

      const response = await fetch("/api/loans", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();
      console.log("RESPONSE:", result);

      if (!response.ok) {
        console.log("API ERROR:", result);
        return;
      }

      setFormData({
        loanAmount: "",
        purpose: "",
        tenureMonths: "",
        interestRatePct: "",
        collateralDetails: "",
      });
      setDocuments([]);
      onLoanCreated();
    } catch (error) {
      console.log("FETCH ERROR:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#e3f3e3] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* ============ LEFT: Form ============ */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-black/[0.08] ring-1 ring-black/[0.04]"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-[#12331F] via-[#0F2318] to-[#0a1a10] px-8 py-9 sm:px-10 sm:py-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4F26A]/15 ring-1 ring-[#D4F26A]/25">
                <Landmark className="h-6 w-6 text-[#D4F26A]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                  FarmSync Credit
                </p>
                <h1
                  className="mt-1 text-2xl font-semibold text-white"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Loan Application
                </h1>
                <p className="mt-1.5 text-sm text-white/50">
                  Tell us what you need and we&apos;ll match you with the right terms.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-8 py-8 sm:px-10 sm:py-9">
            {/* Loan Details */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#12331F]/40">
                Loan Details
              </p>

              <div className="space-y-5">
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
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      placeholder="50,000"
                      className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-8 pr-4 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                    />
                  </div>
                  {errors.loanAmount && (
                    <p className="text-xs text-red-500">{errors.loanAmount}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#12331F]">
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="e.g. Purchasing irrigation equipment"
                    className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                  />
                  {errors.purpose && (
                    <p className="text-xs text-red-500">{errors.purpose}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                      <CalendarClock className="h-3.5 w-3.5 text-[#12331F]/40" />
                      Tenure
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="tenureMonths"
                        value={formData.tenureMonths}
                        onChange={handleChange}
                        placeholder="12"
                        className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-4 pr-14 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#12331F]/35">
                        months
                      </span>
                    </div>
                    {errors.tenureMonths && (
                      <p className="text-xs text-red-500">
                        {errors.tenureMonths}
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
                        name="interestRatePct"
                        value={formData.interestRatePct}
                        onChange={handleChange}
                        placeholder="8.5"
                        className="w-full rounded-xl border border-black/10 bg-[#FAFBF8] py-3 pl-4 pr-8 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#12331F]/35">
                        %
                      </span>
                    </div>
                    {errors.interestRatePct && (
                      <p className="text-xs text-red-500">
                        {errors.interestRatePct}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-black/[0.06]" />

            {/* Collateral & Documents */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#12331F]/40">
                Collateral &amp; Documents
              </p>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#12331F]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#12331F]/40" />
                    Collateral Details
                    <span className="text-[11px] font-normal text-[#12331F]/35">
                      optional
                    </span>
                  </label>
                  <textarea
                    name="collateralDetails"
                    value={formData.collateralDetails}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe any land, equipment, or assets offered as collateral..."
                    className="w-full resize-none rounded-xl border border-black/10 bg-[#FAFBF8] px-4 py-3 text-sm outline-none transition focus:border-[#6FA35A] focus:bg-white focus:ring-4 focus:ring-[#6FA35A]/10"
                  />
                </div>

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
                      onChange={handleFileChange}
                    />
                  </label>

                  {documents.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {documents.map((file, i) => (
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

        {/* ============ RIGHT: Sidebar ============ */}
        <div className="flex flex-col gap-6">
          {/* Process steps */}
          <div className="rounded-[24px] bg-white shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40 mb-5">
              How it works
            </p>
            <ol className="relative space-y-6">
              {PROCESS_STEPS.map((step, i) => {
                const StepIcon = step.icon;
                return (
                  <li key={step.title} className="relative flex items-start gap-3.5">
                    {i !== PROCESS_STEPS.length - 1 && (
                      <span className="absolute left-[15px] top-8 h-[calc(100%+8px)] w-px bg-black/[0.08]" />
                    )}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12331F]/[0.06] text-[#12331F]">
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-semibold text-[#12331F]">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#12331F]/50">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Eligibility tips */}
          <div className="rounded-[24px] bg-white shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12331F]/40 mb-4">
              Before you apply
            </p>
            <ul className="space-y-3">
              {[
                "Minimum loan amount is ₹1,000",
                "Tenure can range from 1 to 360 months",
                "Clear purpose helps faster approval",
                "Collateral details speed up review",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#6FA35A] mt-0.5" />
                  <span className="text-sm text-[#12331F]/70">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust / turnaround card */}
          <div className="rounded-[24px] bg-gradient-to-br from-[#12331F] to-[#0a1a10] p-6 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4F26A]/15 ring-1 ring-[#D4F26A]/25">
              <Sprout className="h-5 w-5 text-[#D4F26A]" />
            </div>
            <p className="mt-4 text-sm font-semibold">Built for farmers like you</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/50">
              Every application is reviewed by a local agronomist who understands
              your land, crop cycle, and needs.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-xs font-medium text-white/80">
              <Clock3 className="h-3.5 w-3.5" />
              Reviewed within 2–3 business days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPage;