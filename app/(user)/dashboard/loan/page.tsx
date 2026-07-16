"use client";
import React, { useState } from "react";

import { toast } from "react-toastify";
import useLoanHook from "@/hooks/useLoanHook";
import AlreadyAppliedLoan from "@/components/farmer/AlreadyAppliedLoan";
import LoanPage from "@/components/farmer/LoanPage";
import { useQueryClient } from "@tanstack/react-query";

const Loan = () => {

  const {loading,data,error}=useLoanHook();
    const queryClient = useQueryClient();
   async function handleLoanCreated() {
    setJustCreated(true);


    await queryClient.invalidateQueries({ queryKey: ["loans"] });

    setTimeout(() => {
      setJustCreated(false);
      toast("Loan Created Successfully"); 
    }, 2500);
  }

    const [justCreated, setJustCreated] = useState(false);
 
 

  if (loading || justCreated) {
    return (
      <div className="bg-[#e3f3e3] h-screen flex flex-col items-center justify-center gap-4">
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "2px solid #e8e4df",
            borderTop: "2px solid #b8860b",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        {justCreated && (
          <p className="text-sm text-[#12331F]/60">
            Creating your loan application...
          </p>
        )}
      </div>
    );
  }
          
 if(error){
  return <h1>Something went wrong</h1>
 }
 
 if (data.length > 0) {
  return (
    <div className="min-h-screen bg-[#e3f3e3] flex justify-center items-center">
      <AlreadyAppliedLoan loan={data[0]} />
    </div>
  );
}
  return (
 <LoanPage onLoanCreated={handleLoanCreated} />
  );
};

export default Loan;
