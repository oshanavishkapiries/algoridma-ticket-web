import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center py-12 overflow-hidden">
      <div className="w-full max-w-3xl space-y-12">
        {/* Main Brand Image with Zoom/Fade Animation */}
        <div className="relative w-full aspect-[16/9] animate-in fade-in zoom-in duration-1000 ease-out">
          <Image
            src="https://i.ibb.co/zWC2JNW9/text.png"
            alt="AlgoRhythm Title"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-8">
          {/* Event Details with Slide Up Animation */}
          <div className="text-primary font-headline font-bold tracking-[0.4em] text-sm md:text-xl uppercase animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            FEBRUARY 28 • IJSE CAR PARK
          </div>

          {/* CTA Section with longer Slide Up Animation delay */}
          <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-10 h-14 text-xl font-headline transition-all group">
              <Link href="/buy-ticket" className="flex items-center gap-3">
                <Ticket className="w-6 h-6 transition-transform group-hover:rotate-12" />
                <span>Buy Ticket • 1000 LKR</span>
              </Link>
            </Button>

            <Link 
              href="/my-tickets" 
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium group"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Already have a ticket? Find it here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
