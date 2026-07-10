"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import corn from '../../public/leaves.json'
export default function Leaves({ className }: { className?: string }) {
  


  type LottieRefCurrentProps={
    speed:number,
    setSpeed:(speed:number)=>void
  }
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
   
    lottieRef.current?.setSpeed(12);
    }, []);
  return (
    <div className={`fixed  inset-0 z-30 flex ${className} h-full w-full`} >
    <style>
     
    </style>
      <Lottie animationData={corn} loop  className=" h-80 w-80 sm:h-96 sm:w-96 lg:h-120 lg:w-120"/>
    </div>

  );
}
