
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  batch: z.string({
    required_error: "Please select a batch",
  }),
  bankSlip: z.any().refine((file) => file?.length > 0, "Bank slip image is required"),
});

export default function BuyTicketPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      batch: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const file = values.bankSlip[0];
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const payload = {
        name: values.name,
        email: values.email,
        batch: values.batch,
        bankSlip: base64Image,
      };

      const response = await fetch("https://central.elight.lk/webhook-test/ijse-algo-ridma/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success === "false" || result.success === false) {
        toast({
          variant: "destructive",
          title: "Request Failed",
          description: result.msg || "An error occurred with your purchase.",
        });
      } else {
        setIsSuccess(true);
        setServerMessage(result.msg || "We let you know after verifying your payment slip. Your ticket will be sent to your email shortly.");
        toast({
          title: "Success!",
          description: result.msg || "Your ticket purchase request has been sent for verification.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Card className="max-w-md w-full text-center p-8 space-y-6 border-2 border-primary/20 shadow-2xl rounded-3xl">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-black text-foreground">Request Received!</h2>
            <p className="text-muted-foreground leading-relaxed">
              {serverMessage}
            </p>
          </div>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 font-headline text-lg text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm border-t-8 border-t-primary">
        <CardHeader className="space-y-2 p-8 text-center bg-secondary/10">
          <CardTitle className="font-headline text-3xl font-black text-foreground">Purchase Your Ticket</CardTitle>
          <CardDescription className="text-base">
            Fill in your details and upload the bank deposit slip to complete your purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" className="h-12 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="name@university.edu" className="h-12 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Batch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select your batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="71">Batch 71</SelectItem>
                        <SelectItem value="73">Batch 73</SelectItem>
                        <SelectItem value="75">Batch 75</SelectItem>
                        <SelectItem value="foundation">Foundation</SelectItem>
                        <SelectItem value="CMJD">CMJD</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankSlip"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold">Bank Slip Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-secondary/5 hover:bg-secondary/10 border-primary/20 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 text-primary/60 mb-3" />
                              <p className="mb-2 text-sm text-foreground font-bold">Click to upload slip</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (Max 5MB)</p>
                            </div>
                            <Input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                handleFileChange(e);
                                onChange(e.target.files);
                              }}
                              {...field}
                            />
                          </label>
                        </div>
                        {preview && (
                          <div className="relative aspect-video rounded-xl overflow-hidden border">
                            <Image
                              src={preview}
                              alt="Bank Slip Preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
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
                    Submitting...
                  </>
                ) : (
                  "Complete Purchase"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
