"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, ArrowLeft, CheckCircle2, AlertCircle, ScanLine, Lock, Utensils, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TicketValidatePage() {
  const { toast } = useToast();
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  
  // Validation State
  const [mode, setMode] = useState<"validate" | "meal">("validate");
  const [isScanning, setIsScanning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRegionId = "reader";
  const html5QrCode = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const correctPin = hh + mm;

    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      toast({
        title: "Authenticated",
        description: "Welcome to the scanner console.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Incorrect PIN. Please check the current time (HHmm).",
      });
      setPinInput("");
    }
  };

  const startScanner = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setHasCameraPermission(true);
        html5QrCode.current = new Html5Qrcode(videoRegionId);
        setIsScanning(true);
        setScanResult(null);

        await html5QrCode.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
          }
        );
      }
    } catch (err) {
      console.error("Camera error:", err);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Please ensure camera permissions are granted.",
      });
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
      await html5QrCode.current.stop();
      setIsScanning(false);
    }

    setIsValidating(true);
    try {
      const response = await fetch("https://central.elight.lk/webhook/ijse-algo-ridma/ticket/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          payload: decodedText,
          mode: mode 
        }),
      });

      const result = await response.json();
      
      const isActuallySuccessful = result.success === "true" || result.success === "ture" || result.success === true;
      
      setScanResult({
        success: isActuallySuccessful,
        msg: result.msg || (isActuallySuccessful ? `${mode === 'validate' ? 'Ticket' : 'Meal'} Validated Successfully` : "Invalid Transaction"),
      });

      if (isActuallySuccessful) {
        toast({
          title: "Success",
          description: result.msg,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Denied",
          description: result.msg,
        });
      }
    } catch (error) {
      setScanResult({ success: false, msg: "Network error occurred during validation." });
    } finally {
      setIsValidating(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    startScanner();
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md">
        <Card className="border-none shadow-2xl bg-zinc-900 border-t-8 border-t-primary">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-black font-headline">Staff Login</CardTitle>
            <CardDescription>Enter the 4-digit security PIN to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  maxLength={4} 
                  placeholder="0000" 
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-3xl tracking-[1em] h-16 bg-zinc-800 border-zinc-700 font-bold"
                />
                <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">
                  Hint: Current local time (HHmm)
                </p>
              </div>
              <Button type="submit" className="w-full h-12 font-headline text-lg">
                Unlock Scanner
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-primary">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
        </Button>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
          <ShieldCheck className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Authenticated Session</span>
        </div>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden bg-zinc-900 border-t-8 border-t-primary">
        <CardHeader className="space-y-4 p-8 text-center bg-zinc-800/50">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className={`p-4 rounded-2xl transition-colors ${mode === 'validate' ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-500'}`}>
              <ScanLine className="w-8 h-8" />
            </div>
            <div className={`p-4 rounded-2xl transition-colors ${mode === 'meal' ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-500'}`}>
              <Utensils className="w-8 h-8" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <CardTitle className="font-headline text-3xl font-black text-white uppercase tracking-tight">
              {mode === 'validate' ? 'Ticket Entry' : 'Meal Issuance'}
            </CardTitle>
            
            <div className="flex items-center space-x-3 bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
              <Label htmlFor="mode-toggle" className={`text-xs font-bold transition-opacity ${mode === 'validate' ? 'text-primary' : 'text-zinc-500 opacity-50'}`}>VALIDATE</Label>
              <Switch 
                id="mode-toggle" 
                checked={mode === 'meal'} 
                onCheckedChange={(checked) => setMode(checked ? 'meal' : 'validate')} 
              />
              <Label htmlFor="mode-toggle" className={`text-xs font-bold transition-opacity ${mode === 'meal' ? 'text-primary' : 'text-zinc-500 opacity-50'}`}>MEAL ISSUE</Label>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {!isScanning && !isValidating && !scanResult && (
            <div className="text-center space-y-4">
              <p className="text-zinc-400 text-sm">
                Ready to {mode === 'validate' ? 'verify entry' : 'issue meal'}. Position QR code in frame.
              </p>
              <Button onClick={startScanner} className="w-full h-14 font-headline text-xl">
                <Camera className="mr-2 w-6 h-6" /> Open Camera
              </Button>
            </div>
          )}

          <div id={videoRegionId} className={isScanning ? "block overflow-hidden border-2 border-primary/20 bg-black aspect-square" : "hidden"}></div>

          {isValidating && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-zinc-400 font-headline uppercase tracking-widest text-xs">Communicating with server...</p>
            </div>
          )}

          {scanResult && (
            <div className="space-y-6">
              <div className={`p-8 rounded-2xl flex flex-col items-center text-center gap-4 ${scanResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                {scanResult.success ? (
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-destructive" />
                )}
                <div>
                  <h3 className={`text-2xl font-black font-headline ${scanResult.success ? 'text-green-500' : 'text-destructive'}`}>
                    {scanResult.success ? "APPROVED" : "REJECTED"}
                  </h3>
                  <p className="text-zinc-300 mt-2 font-medium">{scanResult.msg}</p>
                </div>
              </div>
              <Button onClick={resetScanner} variant="outline" className="w-full h-12 font-headline">
                Next Scan
              </Button>
            </div>
          )}

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser settings to use the validator.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}