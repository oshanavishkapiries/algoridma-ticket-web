import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
      <div className="relative w-full max-w-3xl aspect-[16/9] animate-in fade-in zoom-in duration-1000">
        <Image
          src="https://i.ibb.co/ZR334CqX/text.png"
          alt="AlgoRhythm Title"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
        <Button 
          asChild 
          className="h-16 px-10 bg-primary hover:bg-primary/90 text-black font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all hover:scale-105"
        >
          <Link href="/buy-ticket">BUY TICKETS</Link>
        </Button>
        
        <Button 
          asChild 
          variant="outline" 
          className="h-16 px-10 border-2 border-primary/50 text-primary hover:bg-primary/10 font-black text-xl rounded-2xl transition-all hover:scale-105"
        >
          <Link href="/my-tickets">MY TICKETS</Link>
        </Button>
      </div>

      <div className="mt-16 text-primary/60 font-headline font-bold tracking-[0.3em] uppercase animate-pulse">
        FEBRUARY 28 • IJSE CAR PARK
      </div>
    </div>
  );
}
