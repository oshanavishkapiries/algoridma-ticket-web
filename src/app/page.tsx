
import { MOCK_EVENTS } from "@/app/lib/events";
import { EventCard } from "@/components/EventCard";
import { RecommendationSection } from "@/components/RecommendationSection";
import { Button } from "@/components/ui/button";
import { Ticket, Search, TrendingUp, Music, Cpu, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const categories = [
    { name: "Music", icon: Music, color: "bg-red-500" },
    { name: "Tech", icon: Cpu, color: "bg-orange-500" },
    { name: "Sports", icon: Trophy, color: "bg-blue-500" },
    { name: "Art", icon: TrendingUp, color: "bg-purple-500" },
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/algo_hero/1920/1080"
            alt="Hero background"
            fill
            className="object-cover opacity-30 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
            <TrendingUp className="w-4 h-4" />
            Next Event: algoරිද්ම Main Night - May 15
          </div>
          <h1 className="font-headline text-5xl md:text-8xl font-black text-foreground max-w-4xl mx-auto leading-none">
            FEEL THE <span className="text-primary italic">RHYTHM</span> OF THE UNIVERSITY
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover and book tickets for the most anticipated events happening around your campus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 font-headline text-lg px-8 rounded-full h-14 shadow-lg shadow-primary/20">
              Browse All Events
            </Button>
            <Button size="lg" variant="outline" className="font-headline text-lg px-8 rounded-full h-14 border-primary text-primary hover:bg-primary/5">
              Sell Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <RecommendationSection />

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {categories.map((cat) => (
            <Button key={cat.name} variant="secondary" className="h-20 w-full md:w-48 flex flex-col items-center justify-center gap-2 group transition-all hover:bg-primary hover:text-white">
              <cat.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-headline font-bold">{cat.name}</span>
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="font-headline text-3xl font-black text-foreground">UPCOMING EVENTS</h2>
            <p className="text-muted-foreground">Don't miss out on the hottest campus activities</p>
          </div>
          <Button variant="ghost" className="text-primary font-bold hidden sm:flex">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-primary rounded-3xl p-12 relative overflow-hidden flex flex-col items-center text-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <Ticket className="w-12 h-12 text-white/50" />
          <h2 className="font-headline text-4xl font-bold text-white max-w-2xl">
            ARE YOU ORGANIZING AN EVENT?
          </h2>
          <p className="text-white/80 text-lg max-w-xl">
            Join 50+ campus societies who trust AlgoRhythm for their ticket sales and management.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-headline font-bold px-12 rounded-full h-14">
            Create Event Page
          </Button>
        </div>
      </section>
    </div>
  );
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);
