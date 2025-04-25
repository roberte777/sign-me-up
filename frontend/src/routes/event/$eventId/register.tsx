import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreateGroupData, EventAPI, GroupAPI, type Event } from "@/lib/api";
import { GroupForm } from "@/components/GroupForm";
import { GroupFormValues } from "@/lib/schemas";
import { ArrowLeftIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/event/$eventId/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const { eventId } = Route.useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleRegisterGroup = async (values: GroupFormValues) => {
    setIsLoading(true);
    try {
      const groupData: CreateGroupData = {
        ...values,
        event_id: eventId,
      };
      await GroupAPI.createGroup(groupData);
      // Set active tab to participants to ensure we're showing the groups
      return true;
    } catch (error) {
      console.error("Failed to register group:", error);
      alert("Failed to register group. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await EventAPI.getEvent(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (!event) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <div className="mb-8">
        <Link
          to="/event/$eventId"
          params={{ eventId: eventId }}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Event
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
          <div className="flex flex-col space-y-1 text-muted-foreground">
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>{formatDate(event.date_time)}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Maximum Group Size: {event.group_size_limit}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Register a New Group</h2>
        <p className="text-muted-foreground mb-6">
          Fill out the form to register your group for this event
        </p>
        <GroupForm
          event={event}
          onSubmit={async (values) => {
            await handleRegisterGroup(values);
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
