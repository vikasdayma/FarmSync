"use client";

import Lottie from "lottie-react";
import animationData from "../../public/Loader.json"

const PreLoader = () => {
  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black z-50">
      <Lottie
        animationData={animationData}
        loop
        className="w-fulk h-full"
      />
    </div>
  );
};

export default PreLoader;