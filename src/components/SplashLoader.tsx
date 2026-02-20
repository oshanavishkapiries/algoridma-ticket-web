
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function SplashLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Show loader for a brief moment to simulate platform initialization
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1a1a1a]">
      <div className="relative w-48 h-48 animate-pulse">
        <Image
          src="https://i.ibb.co/4g1cvtGm/images.png"
          alt="AlgoRhythm Loading"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <div className="inline-block h-1 w-48 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
