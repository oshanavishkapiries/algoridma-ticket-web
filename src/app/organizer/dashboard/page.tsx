
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Ticket, 
  DollarSign, 
  Plus, 
  Download, 
  Settings, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_EVENTS } from "@/app/lib/events";

const salesData = [
  { name: "Mon", sales: 400, revenue: 1200 },
  { name: "Tue", sales: 300, revenue: 900 },
  { name: "Wed", sales: 200, revenue: 600 },
  { name: "Thu", sales: 278, revenue: 834 },
  { name: "Fri", sales: 189, revenue: 567 },
  { name: "Sat", sales: 239, revenue: 717 },
  { name: "Sun", sales: 349, revenue: 1047 },
];

export default function OrganizerDashboard() {
  const activeEvent = MOCK_EVENTS[0];
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-black text-foreground">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Managing tickets for <span className="font-bold text-primary italic">algoරිද්ම Tickets</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
          <Button className="bg-primary rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> New Event
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-none text-[10px]">+12.5%</Badge>
            </div>
            <p className="text-2xl font-black font-headline">1,284</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Attendees</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Ticket className="w-5 h-5 text-accent" />
              </div>
              <Badge className="bg-primary/10 text-primary border-none text-[10px]">95% Sold</Badge>
            </div>
            <p className="text-2xl font-black font-headline">2,450</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tickets Sold</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <Badge className="bg-green-500/10 text-green-600 border-none text-[10px]">+8.2%</Badge>
            </div>
            <p className="text-2xl font-black font-headline">$14,520</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Gross Revenue</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-black font-headline">12 Days</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Until Main Night</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 shadow-xl border-none">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Ticket Sales Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8f8f8'}} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === salesData.length - 1 ? '#C0392B' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Events / Recent Activities */}
        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Active Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {MOCK_EVENTS.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={event.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-sm truncate group-hover:text-primary transition-colors cursor-pointer">{event.name}</p>
                  <p className="text-xs text-muted-foreground">{event.ticketsAvailable} tickets left</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-primary">${event.price}</p>
                  <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary mt-4">
              View All Events
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <CardTitle className="font-headline font-bold text-lg">System Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-primary">•</span>
                <span>Waitlist growing for <span className="font-bold">Future AI Summit</span>. Consider adding more seats.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">•</span>
                <span>Promo code 'UNIBEAT' expires in 48 hours.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">•</span>
                <span>Payment gateway maintenance scheduled for Sunday at 02:00 AM.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-accent/5 border-accent/10">
          <CardHeader>
             <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <CardTitle className="font-headline font-bold text-lg">Marketing Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              Ticket sales are peaking between <span className="font-bold text-accent">7:00 PM and 9:00 PM</span>. 
              Social media traffic from Instagram is up by 45%. 
              Recommendation: Run a Flash Sale tomorrow evening to boost <span className="font-bold italic underline">Code-Strike Hackathon</span> registrations.
            </p>
            <Button className="mt-4 bg-accent hover:bg-accent/90 rounded-xl w-full sm:w-auto">Boost Event</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
