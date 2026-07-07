"use client";

import Lottie from "lottie-react";
import a from '../../public/a.json'

export default function Loader({ size = 120 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <Lottie
        animationData={a}
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}