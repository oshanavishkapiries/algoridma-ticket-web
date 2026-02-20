
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Loader2, ArrowLeft, Send, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function MyTicketsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://central.elight.lk/webhook-test/ijse-algo-ridma/my-tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success === "false" || result.success === false) {
        toast({
          variant: "destructive",
          title: "Request Failed",
          description: result.msg || "We couldn't find any tickets associated with this email.",
        });
      } else {
        toast({
          title: "Request Sent",
          description: result.msg || "If an account exists with this email, your tickets have been sent.",
        });
        form.reset();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsWatching(true);
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        
        const base64Image = await base64Promise;
        setPreview(base64Image);

        // Call the watch API immediately
        const response = await fetch("https://central.elight.lk/webhook-test/ijse-algo-ridma/ticket/watch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const result = await response.json();
        
        if (result.success === "true" || result.success === true) {
          toast({
            title: "Ticket Verified",
            description: result.msg || "Your ticket image has been successfully processed.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: result.msg || "We couldn't verify this ticket image.",
          });
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Process Error",
          description: "An error occurred while uploading the image.",
        });
      } finally {
        setIsWatching(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm border-t-8 border-t-primary">
        <CardHeader className="space-y-2 p-8 text-center bg-secondary/10">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl font-black text-foreground">Find My Tickets</CardTitle>
          <CardDescription className="text-base">
            Enter your email or upload your ticket image for verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@university.edu" 
                        className="h-12 rounded-xl" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 bg-primary hover:bg-primary/90 font-headline text-xl rounded-2xl shadow-lg shadow-primary/20 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Retrieve Tickets
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or upload image</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-secondary/5 hover:bg-secondary/10 border-primary/20 transition-colors relative">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isWatching ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-primary/60 mb-2" />
                    <p className="text-sm text-foreground font-bold">Verify via Image</p>
                  </>
                )}
              </div>
              <Input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
                disabled={isWatching}
              />
            </label>

            {preview && (
              <div className="relative aspect-video rounded-xl overflow-hidden border shadow-inner">
                <Image
                  src={preview}
                  alt="Ticket Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
