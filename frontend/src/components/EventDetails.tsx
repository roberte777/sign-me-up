import { Event } from "@/lib/api";
import { Card, CardContent } from "./ui/card";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";
import { formatDate } from "@/lib/utils";

type EventDetailsProp = {
  event: Event;
  eventId: string;
  totalParticipants: number;
};

export function EventDetails({
  event,
  eventId,
  totalParticipants,
}: EventDetailsProp) {
  return (
    <>
      <Card className="shadow-md bg-card/50 backdrop-blur-sm event-card">
        <CardContent className="flex flex-col space-y-3 sm:grid sm:gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(event.date_time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span>Maximum Group Size: {event.group_size_limit}</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  Participants: {totalParticipants} / {event.max_participants}
                  {totalParticipants >= event.max_participants && (
                    <span className="text-destructive text-xs ml-2">(Event Full)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center sm:justify-end">
            <Link to="/event/$eventId/register" params={{ eventId: eventId }}>
              <Button 
                size="lg" 
                className="px-8 w-full sm:w-fit"
                disabled={totalParticipants >= event.max_participants}
              >
                Register a Group
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
