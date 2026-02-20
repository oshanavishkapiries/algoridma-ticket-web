
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
import { Ticket, Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function MyTicketsPage() {
  const { toast } = useToast();
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
      // Logic for retrieving tickets via email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Request Sent",
        description: "If an account exists with this email, your tickets have been sent.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
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

      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm border-t-8 border-t-primary">
        <CardHeader className="space-y-2 p-8 text-center bg-secondary/10">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl font-black text-foreground">Find My Tickets</CardTitle>
          <CardDescription className="text-base">
            Enter your email address to retrieve your purchased tickets.
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
        </CardContent>
      </Card>
    </div>
  );
}
