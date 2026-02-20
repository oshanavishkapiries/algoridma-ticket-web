
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function MyTicketsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          title: "Notice",
          description: result.msg || "We couldn't find any tickets associated with this email.",
        });
      } else if (result.success === "true" || result.success === true) {
        toast({
          title: "Success",
          description: "Redirecting to your ticket...",
        });
        router.push(`/ticket/${encodeURIComponent(values.email)}`);
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </Button>

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-zinc-900 border-t-8 border-t-yellow-400">
        <CardHeader className="space-y-2 p-8 text-center bg-zinc-800/50">
          <div className="mx-auto bg-yellow-400/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 border border-yellow-400/20">
            <Ticket className="w-8 h-8 text-yellow-400" />
          </div>
          <CardTitle className="font-headline text-3xl font-black text-white">Find My Tickets</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your email to retrieve your ticket.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-zinc-300">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@university.edu" 
                        className="h-12 rounded-xl bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" 
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
                className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 font-headline text-xl rounded-2xl shadow-lg shadow-yellow-400/10 text-black font-black"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Retrieve Ticket
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
