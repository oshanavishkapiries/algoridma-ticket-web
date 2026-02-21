
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, UserPlus, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  batch: z.string({
    required_error: "Please select a batch",
  }),
  "ref-name": z.string().min(2, "Reference name is required"),
});

export default function RefTicketPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; name: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDeleted, setIsDeleted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      batch: "",
      "ref-name": "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submittedData && timeLeft > 0 && !isDeleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [submittedData, timeLeft, isDeleted]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://central.elight.lk/webhook/ijse-algo-ridma/buy/ref", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success === "true" || result.success === true) {
        const ticketId = result.data?.id;
        if (!ticketId) {
          throw new Error("API did not return a ticket ID");
        }
        setSubmittedData({ id: ticketId, name: values.name });
        setTimeLeft(30);
        setIsDeleted(false);
        toast({
          title: "Ticket Processed",
          description: "Manual ticket entry successful.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.msg || "An error occurred during processing.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to connect to the server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!submittedData) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`https://central.elight.lk/webhook/ijse-algo-ridma/buy/ref/${submittedData.id}`, {
        method: "GET",
      });

      const result = await response.json();

      if (result.success === "true" || result.success === true) {
        setIsDeleted(true);
        toast({
          title: "Entry Deleted",
          description: "The ticket entry has been successfully removed.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: result.msg || "Could not delete the entry.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the entry.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setSubmittedData(null);
    setIsDeleted(false);
    form.reset();
  };

  if (isDeleted) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Card className="max-w-md w-full text-center p-8 space-y-6 border-2 border-destructive/20 shadow-2xl">
          <div className="mx-auto bg-destructive/10 w-20 h-20 rounded-full flex items-center justify-center">
            <Trash2 className="w-12 h-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-black text-foreground">Entry Deleted</h2>
            <p className="text-muted-foreground">
              The ticket for {submittedData?.name} was cancelled successfully.
            </p>
          </div>
          <Button onClick={resetForm} className="w-full h-12 font-headline text-lg">
            Process Another
          </Button>
        </Card>
      </div>
    );
  }

  if (submittedData) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Card className="max-w-md w-full text-center p-8 space-y-6 border-2 border-primary/20 shadow-2xl overflow-hidden relative">
          <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-black text-foreground">Processed!</h2>
            <p className="text-muted-foreground">
              Manual entry for <span className="text-white font-bold">{submittedData.name}</span> completed.
            </p>
            <p className="text-[10px] text-zinc-500 font-mono bg-zinc-800/50 py-1 px-2 rounded inline-block">
              TICKET ID: {submittedData.id}
            </p>
          </div>

          {timeLeft > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Undo Window</span>
                <span className="text-primary">{timeLeft}s</span>
              </div>
              <Progress value={(timeLeft / 30) * 100} className="h-1.5" />
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full h-12 font-headline gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Ticket #{submittedData.id.slice(-6)}
              </Button>
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={resetForm} 
            className="w-full h-12 font-headline"
            disabled={timeLeft > 0 && isDeleting}
          >
            {timeLeft > 0 ? "Wait for timer or Finish" : "Process New Ticket"}
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

      <Card className="border-none shadow-2xl overflow-hidden bg-zinc-900 border-t-8 border-t-primary">
        <CardHeader className="space-y-2 p-8 text-center bg-zinc-800/50">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 border border-primary/20">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl font-black text-white">Manual Processing</CardTitle>
          <CardDescription className="text-zinc-400">
            Internal tool for manual ticket registration via reference.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-zinc-400">Attendee Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" className="h-12 bg-zinc-800 border-zinc-700" {...field} />
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
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-zinc-400">Attendee Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address" className="h-12 bg-zinc-800 border-zinc-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-zinc-400">Batch</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Select batch" />
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
                  name="ref-name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold uppercase tracking-wider text-zinc-400">Reference Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name (Ref)" className="h-12 bg-zinc-800 border-zinc-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 font-headline text-xl mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Ticket"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
