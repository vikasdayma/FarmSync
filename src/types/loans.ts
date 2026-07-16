export type LoanStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED"
  | "REPAID"
  | "DEFAULTED";

export interface LoanUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Loan {
  id: string;
  appNo: string;
  loanAmount: string;
  purpose: string;
  tenureMonths: number;
  interestRatePct: number;
  collateralDetails: string | null;
  status: LoanStatus;
  documents: string[];
  userId: string;
  user?: LoanUser;
  reviewedBy: string | null;
  reviewNotes: string | null;
  reviewedAt: string | null;
  disbursedAt: string | null;
  repaidAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}