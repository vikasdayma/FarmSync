import { Loan } from '@/types/loans'
import { Check, FileText, User, X, XCircle } from 'lucide-react'
import React from 'react'
import useApproveLoan from '@/lib/api/approveLoan'
import { toast } from 'react-toastify'
import useRejectLoan from '@/lib/api/rejectLoan'
interface ModalProp{
selectedLoan:Loan | null
setSelectedLoan:(loan:Loan | null)=>void 
statusStyles:Record<string, string>,
 formatDate:(d: string | null)=> string
  formatCurrency:(amt: string | number)=>string


}
const ModelLoan = ({selectedLoan,setSelectedLoan,statusStyles,formatCurrency,formatDate}:ModalProp) => {
    if (!selectedLoan) return null;
    const {mutate:LoanApproval}=useApproveLoan();
    const {mutate:LoanRejection}=useRejectLoan();
    const handleApprove=()=>{
       LoanApproval({
    id: selectedLoan.id,
    reviewNotes: 'your documents are correct we are assigning you this loan make sure you pay emi on time',
  })
   setSelectedLoan(null);
   toast('loan approved')
    }
    const handleRejected=()=>{
    LoanRejection({
    id: selectedLoan.id,
    reviewNotes: 'your documents are incorrect we are rejecting your loan request',
  })
   setSelectedLoan(null);
   toast('loan rejected')
    }
    return (
          <div
          className="fixed inset-0 bg-[#0e2818]/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedLoan(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
      
            <div className="sticky top-0 bg-white border-b border-[#0e2818]/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="font-bold text-[#0e2818]">Loan Application</h2>
                <p className="text-xs text-[#0e2818]/40 font-mono">{selectedLoan?.appNo}</p>
              </div>
              <button
                onClick={() => setSelectedLoan(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#0e2818]/5 transition-colors"
              >
                <X className="w-4 h-4 text-[#0e2818]/60" />
              </button>
            </div>

     
            <div className="px-6 py-5 flex flex-col gap-5">
              <span
                className={`self-start text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  statusStyles[selectedLoan?.status] ?? 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {selectedLoan?.status}
              </span>

              <div>
                <p className="text-xs font-semibold text-[#0e2818]/40 uppercase tracking-wide mb-1">Purpose</p>
                <p className="text-sm text-[#0e2818]">{selectedLoan?.purpose}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#0e2818]/40 uppercase tracking-wide mb-1">Collateral Details</p>
                <p className="text-sm text-[#0e2818]">{selectedLoan?.collateralDetails}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#fbf9f2] rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#0e2818]/40 uppercase tracking-wide mb-1">Loan Amount</p>
                  <p className="text-sm font-semibold text-[#0e2818]">{formatCurrency(selectedLoan?.loanAmount)}</p>
                </div>
                <div className="bg-[#fbf9f2] rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#0e2818]/40 uppercase tracking-wide mb-1">Tenure</p>
                  <p className="text-sm font-semibold text-[#0e2818]">{selectedLoan?.tenureMonths} months</p>
                </div>
                <div className="bg-[#fbf9f2] rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#0e2818]/40 uppercase tracking-wide mb-1">Interest Rate</p>
                  <p className="text-sm font-semibold text-[#0e2818]">{selectedLoan?.interestRatePct}% p.a.</p>
                </div>
                <div className="bg-[#fbf9f2] rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-[#0e2818]/40 uppercase tracking-wide mb-1">Applied On</p>
                  <p className="text-sm font-semibold text-[#0e2818]">{formatDate(selectedLoan?.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#0e2818]/50 border-t border-[#0e2818]/10 pt-4">
                <User className="w-3.5 h-3.5" />
                <span className="font-mono">{selectedLoan?.userId}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#0e2818]/50">
                <FileText className="w-3.5 h-3.5" />
                <span>{selectedLoan?.documents?.length ?? 0} document(s) attached</span>
              </div>

              {(selectedLoan?.disbursedAt || selectedLoan?.repaidAt || selectedLoan?.reviewedAt) && (
                <div className="flex flex-col gap-1.5 text-xs text-[#0e2818]/50 border-t border-[#0e2818]/10 pt-4">
                  <span>Reviewed: {formatDate(selectedLoan?.reviewedAt)}</span>
                  <span>Disbursed: {formatDate(selectedLoan?.disbursedAt)}</span>
                  <span>Repaid: {formatDate(selectedLoan?.repaidAt)}</span>
                </div>
              )}
            </div>


            <div className="sticky bottom-0 bg-white border-t border-[#0e2818]/10 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button  onClick={handleRejected} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button onClick={handleApprove} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0F3D2E] text-[#d4f26a] font-semibold text-sm hover:bg-[#0e2818] transition-colors">
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
  )
}

export default ModelLoan