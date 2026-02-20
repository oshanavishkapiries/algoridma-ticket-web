
"use client";

import { useParams, useRouter } from "next/navigation";
import { MOCK_EVENTS } from "@/app/lib/events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Ticket, ArrowLeft, ShieldCheck, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);

  const event = MOCK_EVENTS.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl font-headline font-bold">Event Not Found</h1>
        <Button asChild className="bg-primary">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const handlePurchase = () => {
    setIsBuying(true);
    // Simulate payment process
    setTimeout(() => {
      setIsBuying(false);
      toast({
        title: "Purchase Successful!",
        description: `You have successfully bought ${quantity} ticket(s) for ${event.name}. Check your email for confirmation.`,
      });
      router.push("/profile");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to events
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-6 left-6 flex gap-2">
              <Badge className="bg-primary px-4 py-1.5 text-sm font-bold shadow-lg">
                {event.category}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-headline text-4xl md:text-5xl font-black text-foreground">
              {event.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-secondary/20 border-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Date & Time</p>
                  <p className="font-headline font-bold">{new Date(event.date).toDateString()} @ {event.time}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/20 border-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Location</p>
                  <p className="font-headline font-bold">{event.location}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/20 border-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Organizer</p>
                  <p className="font-headline font-bold">{event.organizer}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-secondary/20 border-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tickets Left</p>
                  <p className="font-headline font-bold">{event.ticketsAvailable} available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Checkout Box */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-2 border-primary/20 shadow-xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur">
            <div className="bg-primary p-6 text-white text-center">
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1">Single Ticket</p>
              <p className="text-4xl font-headline font-black">${event.price.toFixed(2)}</p>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline font-bold text-lg">Quantity</span>
                  <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-xl border">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-primary font-black"
                    >
                      -
                    </button>
                    <span className="font-headline font-bold w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-primary font-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4 flex items-center justify-between text-xl font-headline font-black">
                  <span>TOTAL</span>
                  <span className="text-primary">${(event.price * quantity).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handlePurchase}
                  disabled={isBuying}
                  className="w-full h-14 bg-primary hover:bg-primary/90 font-headline text-lg rounded-2xl shadow-lg shadow-primary/20"
                >
                  {isBuying ? "Processing Payment..." : "Purchase Tickets Now"}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secure checkout powered by University Pay
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full border-dashed rounded-2xl h-12 flex gap-2">
            <Share2 className="w-4 h-4" /> Share with friends
          </Button>
        </div>
      </div>
    </div>
  );
}
