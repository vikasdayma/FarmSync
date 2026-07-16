'use client'
import useLoanHook from '@/hooks/useLoanHook';
import React, { useState } from 'react'
import {
  Loader2,
  Sprout,
  Calendar,
  IndianRupee,
  Percent,
  Clock,
  Inbox,
  AlertTriangle,
} from 'lucide-react'

import { Loan } from '@/types/loans';

import ModelLoan from '@/components/agronomist/Loan/ModelLoan';

const statusStyles: Record<string, string> = {
  SUBMITTED: 'bg-[#d4f26a]/15 text-[#0F3D2E] border border-[#d4f26a]/40',
  APPROVED: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30',
  REJECTED: 'bg-red-500/15 text-red-600 border border-red-500/30',
  DISBURSED: 'bg-blue-500/15 text-blue-700 border border-blue-500/30',
  REPAID: 'bg-gray-500/15 text-gray-600 border border-gray-500/30',
}

const formatDate = (d: string | null) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatCurrency = (amt: string | number) => {
  return `₹${Number(amt).toLocaleString('en-IN')}`
}

const Loans = () => {
  const { loading, data, error } = useLoanHook()
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)

  const loans: Loan[] = Array.isArray(data) ? data : data ? [data] : []


  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0F3D2E] animate-spin" />
          <p className="text-[#0F3D2E]/70 font-medium">Loading loan applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f2] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-[#0e2818]">Failed to load loans</h2>
          <p className="text-sm text-[#0e2818]/60">
            {typeof error === 'string' ? error : 'Something went wrong while fetching loan applications.'}
          </p>
        </div>
      </div>
    )
  }

  // ---------- Empty State ----------
  if (!loans.length) {
    return (
      <div className="min-h-screen bg-[#fbf9f2] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-[#0F3D2E]/10 flex items-center justify-center">
            <Inbox className="w-7 h-7 text-[#0F3D2E]" />
          </div>
          <h2 className="text-lg font-semibold text-[#0e2818]">No loan applications yet</h2>
          <p className="text-sm text-[#0e2818]/60">
            New farmer loan applications will show up here for your review.
          </p>
        </div>
      </div>
    )
  }

  // ---------- Main List ----------
  return (
    <div className="min-h-screen bg-[#fbf9f2] px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#0F3D2E] flex items-center justify-center">
            <Sprout className="w-5 h-5 text-[#d4f26a]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0e2818]">Loan Applications</h1>
            <p className="text-sm text-[#0e2818]/50">{loans.length} application{loans.length > 1 ? 's' : ''} to review</p>
          </div>
        </div>

 
        <div className="flex flex-col gap-4">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="bg-white border shadow-sm border-[#0e2818]/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:shadow-[#0F3D2E]/5 transition-shadow"
            >
              {/* Left: Loan Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-mono text-[#0e2818]/40">
                    #{loan.appNo.slice(0, 8)}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      statusStyles[loan.status] ?? 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>

                <p className="text-[#0e2818] font-medium text-sm sm:text-base line-clamp-1 mb-3">
                  {loan.purpose.toUpperCase()}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#0e2818]/60">
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    {formatCurrency(loan.loanAmount)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    {loan.tenureMonths} months
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    {loan.interestRatePct}% p.a.
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0F3D2E]" />
                    {formatDate(loan.createdAt)}
                  </span>
                </div>
              </div>

              {/* Right: View Details Button */}
              <div className="flex sm:justify-end">
                <button
                  onClick={() => setSelectedLoan(loan)}
                  className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#0F3D2E] text-[#d4f26a] text-sm font-semibold hover:bg-[#0e2818] transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    
      {selectedLoan && (
<ModelLoan selectedLoan={selectedLoan}
 statusStyles={statusStyles}
 formatDate={formatDate}
  formatCurrency={formatCurrency}
setSelectedLoan={setSelectedLoan}/>
      )}
    </div>
  )
}

export default Loans