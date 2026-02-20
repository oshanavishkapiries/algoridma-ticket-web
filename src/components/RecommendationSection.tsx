
"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { recommendEvents, PersonalizedEventRecommendationsOutput } from "@/ai/flows/personalized-event-recommendations";
import { MOCK_EVENTS } from "@/app/lib/events";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<PersonalizedEventRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecommendations() {
      try {
        const result = await recommendEvents({
          userId: "user_123",
          pastPurchases: ["Future AI Summit", "Startup Networking Night"],
          preferences: ["Technology", "Entrepreneurship", "Music"],
          upcomingEvents: MOCK_EVENTS.map(e => ({
            id: e.id,
            name: e.name,
            date: e.date,
            category: e.category,
            description: e.description
          }))
        });
        setRecommendations(result);
      } catch (error) {
        console.error("Failed to load recommendations", error);
      } finally {
        setLoading(false);
      }
    }
    getRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          <h2 className="font-headline text-2xl font-bold">Personalized for you</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse bg-muted h-32"></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 p-2 rounded-full">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold">AI Recommended</h2>
            <p className="text-sm text-muted-foreground">Based on your tech & music interests</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.recommendations.map((rec) => (
          <Card key={rec.id} className="border-l-4 border-l-accent overflow-hidden hover:translate-x-1 transition-transform bg-card/50">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-accent border-accent/30">{rec.category}</Badge>
                <span className="text-xs font-medium text-muted-foreground">{rec.date}</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-2">{rec.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 italic">
                "{rec.reason}"
              </p>
              <div className="mt-auto">
                <Button variant="ghost" size="sm" asChild className="p-0 h-auto text-accent hover:text-accent/80 font-bold flex items-center gap-1">
                  <Link href={`/events/${rec.id}`}>
                    Learn more <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
