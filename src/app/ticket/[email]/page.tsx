
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
      // Ensure images are loaded before capture
      const dataUrl = await toPng(ticketRef.current, { 
        cacheBust: true,
        backgroundColor: '#1a1a1a', // Match the outer background for clean rounded corners
        style: {
          borderRadius: '20px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `Algoridma-Ticket-${data?.id || 'entry'}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "Your ticket has been downloaded as an image.",
      });
    } catch (err) {
      console.error('Download failed', err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate ticket image. Please try taking a screenshot instead.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#1a1a1a]">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
        <p className="text-zinc-400 font-headline text-lg animate-pulse">Fetching your ticket...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4 bg-[#1a1a1a]">
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
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="mb-8 flex gap-4">
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

      {/* Ticket UI - Portable HTML Template */}
      <div 
        ref={ticketRef}
        className="ticket bg-black w-[350px] rounded-[20px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] border-2 border-[#FFD700] relative"
        style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}
      >
        {/* Top: Poster */}
        <div className="poster w-full h-[200px] border-b-[5px] border-[#FFD700] relative">
          <img 
            src="https://i.ibb.co/0VVxTgxQ/Whats-App-Image-2026-02-19-at-12-38-32.jpg" 
            alt="Poster" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>

        {/* Main Content */}
        <div className="content p-[25px] text-center">
          <h1 className="event-name text-[2.4rem] font-[900] uppercase text-[#FFD700] m-0 tracking-[2px] italic leading-tight">
            Algoridma
          </h1>
          
          <div className="details my-[15px] border-b border-[#333] pb-[15px]">
            <p className="m-[5px_0] text-[0.85rem] text-[#eee] tracking-[1px]">
              DATE: <span className="text-[#FFD700] font-bold">FEB 28, 2026</span>
            </p>
            <p className="m-[5px_0] text-[0.85rem] text-[#eee] tracking-[1px]">
              VENUE: <span className="text-[#FFD700] font-bold">IJSE CAR PARK</span>
            </p>
          </div>

          <div className="info-grid grid grid-cols-1 gap-[15px] mt-[15px]">
            <div className="info-box bg-[#111] p-[12px] border-l-4 border-[#FFD700] text-left">
              <span className="label block text-[0.65rem] text-[#FFD700] uppercase font-[800] mb-[4px]">Attendee Name</span>
              <span className="value text-white text-[1.1rem] font-[600] uppercase">{data.name}</span>
            </div>
            <div className="info-box bg-[#111] p-[12px] border-l-4 border-[#FFD700] text-left">
              <span className="label block text-[0.65rem] text-[#FFD700] uppercase font-[800] mb-[4px]">Ticket Serial ID</span>
              <span className="value text-white text-[1.1rem] font-[600] uppercase">#{data.id}</span>
            </div>
          </div>
        </div>

        {/* QR Section */}
        <div className="qr-section bg-[#FFD700] p-[25px] flex flex-col items-center relative">
          {/* Notches */}
          <div className="notch absolute bg-[#1a1a1a] w-[30px] h-[30px] rounded-full top-[-15px] left-[-15px]"></div>
          <div className="notch absolute bg-[#1a1a1a] w-[30px] h-[30px] rounded-full top-[-15px] right-[-15px]"></div>
          
          <div className="qr-container bg-white p-[8px] rounded-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            <img 
              src={data.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.id}`} 
              alt="QR Code" 
              className="w-[120px] h-[120px] block"
              crossOrigin="anonymous"
            />
          </div>
          <div className="footer-text mt-[10px] font-[900] color-black text-[0.8rem] tracking-[1px] text-black">SCAN FOR ENTRY</div>
        </div>
      </div>
      
      <p className="mt-8 text-zinc-500 text-sm">
        Ticket generated for {decodeURIComponent(email as string)}
      </p>
    </div>
  );
}
