
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, ArrowLeft, CheckCircle2, AlertCircle, ScanLine } from "lucide-react";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function TicketValidatePage() {
  const { toast } = useToast();
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
            // Silently ignore scan failures
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
      const response = await fetch("https://central.elight.lk/webhook/ijse-algo-ridma/ticket/qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: decodedText }),
      });

      const result = await response.json();
      setScanResult({
        success: result.success === "true" || result.success === true,
        msg: result.msg || (result.success === "true" ? "Ticket Validated Successfully" : "Invalid Ticket"),
      });

      if (result.success === "true" || result.success === true) {
        toast({
          title: "Access Granted",
          description: result.msg,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>

      <Card className="border-none shadow-2xl overflow-hidden bg-zinc-900 border-t-8 border-t-primary">
        <CardHeader className="space-y-2 p-8 text-center bg-zinc-800/50">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 border border-primary/20">
            <ScanLine className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl font-black text-white">Ticket Validator</CardTitle>
          <CardDescription className="text-zinc-400">
            Scan QR code for entry verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {!isScanning && !isValidating && !scanResult && (
            <div className="text-center space-y-4">
              <p className="text-zinc-400 text-sm">Position the ticket QR code within the frame to scan.</p>
              <Button onClick={startScanner} className="w-full h-14 font-headline text-xl">
                <Camera className="mr-2 w-6 h-6" /> Start Scanner
              </Button>
            </div>
          )}

          <div id={videoRegionId} className={isScanning ? "block rounded-lg overflow-hidden border-2 border-primary/20" : "hidden"}></div>

          {isValidating && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-zinc-400 font-headline">Validating ticket...</p>
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
                    {scanResult.success ? "VALID TICKET" : "INVALID TICKET"}
                  </h3>
                  <p className="text-zinc-300 mt-2">{scanResult.msg}</p>
                </div>
              </div>
              <Button onClick={resetScanner} variant="outline" className="w-full h-12 font-headline">
                Scan Next Ticket
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
