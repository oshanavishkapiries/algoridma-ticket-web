
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toPng } from 'html-to-image';
import { useToast } from "@/hooks/use-toast";

interface TicketData {
  name: string;
  id: string;
  qr_url: string;
}

export default function TicketDisplayPage() {
  const { email } = useParams();
  const { toast } = useToast();
  const [data, setData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch("https://central.elight.lk/webhook-test/ijse-algo-ridma/my-tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: decodeURIComponent(email as string) }),
        });

        const result = await response.json();

        if (result.success === "true" || result.success === true) {
          setData(result.data);
        } else {
          setError(result.msg || "Could not load ticket data.");
        }
      } catch (err: any) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    }

    if (email) fetchTicket();
  }, [email]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure any dynamic parts (like the QR) are fully rendered
      const dataUrl = await toPng(ticketRef.current, { 
        cacheBust: true,
        backgroundColor: '#000000',
        style: {
          borderRadius: '20px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `Algoridma-Ticket-${data?.id || 'entry'}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Download Started",
        description: "Your ticket is being saved to your device.",
      });
    } catch (err) {
      console.error('Download failed', err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "We couldn't generate the ticket image. Please try again or take a screenshot.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
        <p className="text-zinc-400 font-headline text-lg animate-pulse">Fetching your ticket...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-destructive/10 p-6 rounded-full">
          <p className="text-destructive font-bold text-xl">{error || "Ticket not found"}</p>
        </div>
        <Button asChild className="bg-yellow-400 text-black font-black">
          <Link href="/my-tickets">Try Again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen animate-in fade-in zoom-in duration-500">
      <div className="mb-8 flex gap-4 no-print">
        <Button variant="outline" asChild className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10">
          <Link href="/my-tickets"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-black shadow-lg shadow-yellow-400/20"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? "Generating..." : "Download PNG"}
        </Button>
      </div>

      {/* Ticket UI Implementation */}
      <div 
        ref={ticketRef}
        className="ticket-container bg-black w-[350px] rounded-[20px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] border-2 border-yellow-400 relative"
      >
        {/* Top: Poster */}
        <div className="w-full h-[200px] border-b-[5px] border-yellow-400 relative">
          <Image 
            src="https://i.ibb.co/0VVxTgxQ/Whats-App-Image-2026-02-19-at-12-38-32.jpg" 
            alt="Algoridma Poster"
            fill
            className="object-cover"
            priority
            unoptimized // Helps html-to-image by not using next's internal loader for this specific capture
          />
        </div>

        {/* Main Content */}
        <div className="p-[25px] text-center bg-black">
          <h1 className="text-[2.4rem] font-black uppercase text-yellow-400 m-0 tracking-[2px] italic leading-tight">
            Algoridma
          </h1>
          
          <div className="my-[15px] border-b border-zinc-800 pb-[15px] space-y-1">
            <p className="text-[0.85rem] text-zinc-200 tracking-wider">DATE: <span className="text-yellow-400 font-bold">FEB 28, 2026</span></p>
            <p className="text-[0.85rem] text-zinc-200 tracking-wider">VENUE: <span className="text-yellow-400 font-bold">IJSE CAR PARK</span></p>
          </div>

          <div className="grid grid-cols-1 gap-[15px] mt-[15px]">
            <div className="bg-zinc-900/50 p-[12px] border-l-4 border-yellow-400 text-left">
              <span className="block text-[0.65rem] text-yellow-400 uppercase font-extrabold mb-1">Attendee Name</span>
              <span className="text-white text-[1.1rem] font-semibold uppercase">{data.name}</span>
            </div>
            <div className="bg-zinc-900/50 p-[12px] border-l-4 border-yellow-400 text-left">
              <span className="block text-[0.65rem] text-yellow-400 uppercase font-extrabold mb-1">Ticket Serial ID</span>
              <span className="text-white text-[1.1rem] font-semibold uppercase">#{data.id}</span>
            </div>
          </div>
        </div>

        {/* QR Section */}
        <div className="bg-yellow-400 p-[25px] flex flex-col items-center relative">
          {/* Notches */}
          <div className="absolute bg-background w-[30px] h-[30px] rounded-full top-[-15px] left-[-15px]"></div>
          <div className="absolute bg-background w-[30px] h-[30px] rounded-full top-[-15px] right-[-15px]"></div>
          
          <div className="bg-white p-2 rounded shadow-lg">
            <img 
              src={data.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.id}`} 
              alt="QR Code" 
              className="w-[120px] h-[120px] block"
              crossOrigin="anonymous" // Required for html-to-image to work with external images
            />
          </div>
          <div className="mt-2.5 font-black text-black text-[0.8rem] tracking-widest">SCAN FOR ENTRY</div>
        </div>
      </div>
      
      <p className="mt-8 text-zinc-500 text-sm">
        Ticket generated for {decodeURIComponent(email as string)}
      </p>
    </div>
  );
}
