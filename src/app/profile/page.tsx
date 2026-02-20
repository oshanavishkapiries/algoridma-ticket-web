
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Ticket, Settings, Bell, ChevronRight, LogOut, QrCode, Calendar } from "lucide-react";
import { MOCK_EVENTS } from "@/app/lib/events";
import Link from "next/link";

export default function ProfilePage() {
  const userPurchases = [
    { ...MOCK_EVENTS[1], purchaseDate: "2025-04-10", status: "Valid" },
    { ...MOCK_EVENTS[5], purchaseDate: "2025-04-12", status: "Used" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-card p-8 rounded-3xl shadow-lg border-b-4 border-b-primary">
        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 overflow-hidden">
          <User className="w-16 h-16 text-primary" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="font-headline text-4xl font-black text-foreground">Saman Perera</h1>
          <p className="text-muted-foreground text-lg mb-4">saman.p@university.edu • Level 3 Computer Science</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">Event Lover</Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent font-bold">Hackathon Pro</Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 font-bold">Early Bird</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl border-primary/20"><Settings className="w-5 h-5" /></Button>
          <Button variant="outline" size="icon" className="rounded-xl border-primary/20"><Bell className="w-5 h-5" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Tickets Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary" /> Your Tickets
            </h2>
            <Button variant="link" className="text-primary font-bold">Archive</Button>
          </div>

          <div className="space-y-4">
            {userPurchases.map((purchase, i) => (
              <Card key={i} className={`overflow-hidden border-none shadow-md ${purchase.status === 'Used' ? 'opacity-60 grayscale' : ''}`}>
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square relative flex-shrink-0">
                    <img src={purchase.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={purchase.status === 'Valid' ? 'bg-green-500' : 'bg-muted text-muted-foreground'}>
                          {purchase.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-headline text-xl font-bold mb-1">{purchase.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(purchase.date).toDateString()} @ {purchase.time}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <Button variant="outline" className="text-xs font-bold gap-2 rounded-lg">
                        <QrCode className="w-4 h-4" /> View Ticket
                      </Button>
                      <Button asChild variant="ghost" className="text-xs font-bold gap-1 hover:text-primary p-0 h-auto">
                        <Link href={`/events/${purchase.id}`}>Event Details <ChevronRight className="w-3 h-3" /></Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="shadow-lg border-none bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold">Quick Actions</h3>
                <p className="text-white/70 text-sm">Manage your account and preferences.</p>
              </div>
              <div className="space-y-2">
                <Button className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl h-12">
                  Payment Methods <ChevronRight className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl h-12">
                  Privacy Settings <ChevronRight className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl h-12">
                  Help & Support <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-red-900 mt-4 border-t border-white/10 pt-6 rounded-none justify-start gap-3">
                <LogOut className="w-5 h-5" /> Logout
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-3xl bg-secondary/20">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Interested in AI?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We've noticed you've been attending many tech events. Check out our AI-powered community forum!
              </p>
              <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary">Join Discord</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
