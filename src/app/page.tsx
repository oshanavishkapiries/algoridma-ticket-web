import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center py-12">
      <div className="w-full max-w-3xl space-y-12">
        <div className="relative w-full aspect-[16/9] animate-in fade-in zoom-in duration-1000">
          <Image
            src="https://i.ibb.co/zWC2JNW9/text.png"
            alt="AlgoRhythm Title"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-8">
          <div className="text-primary font-headline font-bold tracking-[0.4em] text-sm md:text-xl uppercase animate-pulse">
            FEBRUARY 28 • IJSE CAR PARK
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
            <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 rounded-full px-10 h-14 text-xl font-headline transition-all group">
              <Link href="/buy-ticket" className="flex items-center gap-3">
                <Ticket className="w-6 h-6 transition-transform group-hover:rotate-12" />
                <span>Buy Ticket</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
