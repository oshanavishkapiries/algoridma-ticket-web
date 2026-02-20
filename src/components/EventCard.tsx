
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UniversityEvent } from "@/app/lib/events";

interface EventCardProps {
  event: UniversityEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event.image}
          alt={event.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="event cover"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 text-primary font-bold">
            ${event.price.toFixed(2)}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-primary/90 hover:bg-primary font-medium">
            {event.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-5 pb-0">
        <h3 className="font-headline text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {event.name}
        </h3>
      </CardHeader>
      <CardContent className="p-5 pt-3 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="truncate">{event.location}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button asChild className="flex-1 bg-primary hover:bg-primary/90 font-headline rounded-lg">
          <Link href={`/events/${event.id}`}>Get Tickets</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
