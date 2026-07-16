// import { useEffect, useState } from "react";

// interface LoanUser {
//   id: string;
//   firstName: string;
//   lastName: string;
// }

// interface Loan {
//   id: string;
//   appNo: string;
//   loanAmount: string; // note: comes back as string, not number
//   purpose: string;
//   tenureMonths: number;
//   interestRatePct: number;
//   collateralDetails: string | null;
//   status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DISBURSED"; // adjust to match your actual enum values
//   documents: string[];
//   userId: string;
//   user: LoanUser;
//   reviewedBy: string | null;
//   reviewNotes: string | null;
//   reviewedAt: string | null;
//   disbursedAt: string | null;
//   repaidAt: string | null;
//   deletedAt: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Meta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// const useLoanHook = () => {
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<Loan[]>([]);
//   const [meta, setMeta] = useState<Meta | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function getLoans() {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch("/api/loans", {
//           credentials: "include",
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(result?.message || `Failed to fetch loans (${response.status})`);
//         }

//         setData(result.data ?? []);
//         setMeta(result.meta ?? null);
//       } catch (err) {
//         console.error("LOANS FETCH ERROR:", err);
//         setError(err instanceof Error ? err.message : "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     getLoans();
//   }, []);

//   return { data, meta, loading, error };
// };

// export default useLoanHook;

import { useQuery } from "@tanstack/react-query";
import type { Loan } from "@/types/loans";

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LoansResponse {
  data: Loan[];
  meta: Meta | null;
}

async function fetchLoans(): Promise<LoansResponse> {
  const response = await fetch("/api/loans", {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || `Failed to fetch loans (${response.status})`);
  }

  return {
    data: result.data ?? [],
    meta: result.meta ?? null,
  };
}

const useLoanHook = () => {
  const { data, isLoading, error, ...rest } = useQuery({
    queryKey: ["loans"],
    queryFn: fetchLoans,
  });

  return {
    data: data?.data ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    ...rest,
  };
};

export default useLoanHook;