import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <div className="relative w-full max-w-3xl aspect-[16/9] animate-in fade-in zoom-in duration-1000">
        <Image
          src="https://i.ibb.co/zWC2JNW9/text.png"
          alt="AlgoRhythm Title"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="mt-16 text-primary/60 font-headline font-bold tracking-[0.3em] uppercase animate-pulse">
        FEBRUARY 28 • IJSE CAR PARK
      </div>
    </div>
  );
}
