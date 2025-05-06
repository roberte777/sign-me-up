import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { EventAPI, GroupAPI, type Event, type Group } from "@/lib/api";
import { GroupForm } from "@/components/GroupForm";
import type { GroupFormValues } from "@/lib/schemas";
import { ArrowLeftIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/event/$eventId/edit")({
  component: EditGroup,
  validateSearch: (search): { groupId?: number } => {
    return {
      groupId: search.groupId ? Number(search.groupId) : undefined,
    };
  },
});

function EditGroup() {
  const { eventId } = Route.useParams();
  const searchParams = Route.useSearch();
  const groupId = searchParams.groupId;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event data
        const eventData = await EventAPI.getEvent(eventId);
        setEvent(eventData);

        // Fetch group data if groupId is provided
        if (groupId) {
          const groupData = await GroupAPI.getGroup(groupId);
          setGroup(groupData);
        } else {
          setError("No group ID provided");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load group or event data");
      }
    };

    fetchData();
  }, [eventId, groupId]);

  const handleUpdateGroup = async (values: GroupFormValues) => {
    if (!group) return;

    setIsLoading(true);
    try {
      await GroupAPI.updateGroup(group.id, values);
      // Navigate back to event page after successful update
      navigate({ to: "/event/$eventId", params: { eventId } });
    } catch (error) {
      setIsLoading(false);
      throw(error);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Link
          to="/event/$eventId"
          params={{ eventId }}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Event
        </Link>
      </div>
    );
  }

  if (!event || !group) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-2 sm:py-8 mx-auto">
      <div className="mb-8">
        <Link
          to="/event/$eventId"
          params={{ eventId }}
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
        <h2 className="text-2xl font-semibold mb-6">Edit Group</h2>
        <p className="text-muted-foreground mb-6">
          Update your group information for this event
        </p>
        <GroupForm
          event={event}
          existingGroup={group}
          onSubmit={handleUpdateGroup}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
