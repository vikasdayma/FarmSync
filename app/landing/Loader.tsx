"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import corn from '../../public/leaves.json'
export default function Loader({ className }: { className?: string }) {
  // const [animationData, setAnimationData] = useState(null);

  // useEffect(() => {
  //   fetch("../public/a.json")
  //     .then((res) => res.json())
  //     .then(setAnimationData);
  // }, []);

  // if (!animationData) return null;
  type LottieRefCurrentProps={
    speed:number,
    setSpeed:(speed:number)=>void
  }
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    // 0.5 = Half speed
    // 1 = Normal speed
    // 2 = Double speed
    // 3 = Triple speed
    lottieRef.current?.setSpeed(12);
    }, []);
  return (
    <div className={`fixed  inset-0 flex ${className} h-full w-full`} >
    
      <Lottie animationData={corn} loop style={{ width: 450, height: 450 }} />
    </div>

  );
}
