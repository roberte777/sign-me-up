import { CreateGroupData, Event, GroupAPI } from "@/lib/api";
import { Card, CardContent } from "./ui/card";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { GroupForm } from "./GroupForm";
import { useState } from "react";
import { GroupFormValues } from "@/lib/schemas";

type EventDetailsProp = {
  event: Event;
  fetchGroups: () => Promise<void>;
  eventId: string;
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    // Format the date using Intl.DateTimeFormat for better localization
    return new Intl.DateTimeFormat("default", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original if parsing fails
  }
};

export function EventDetails({
  event,
  fetchGroups,
  eventId,
}: EventDetailsProp) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleRegisterGroup = async (values: GroupFormValues) => {
    setIsLoading(true);
    try {
      const groupData: CreateGroupData = {
        ...values,
        event_id: eventId,
      };
      await GroupAPI.createGroup(groupData);
      await fetchGroups();
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
            </div>
          </div>
          <div className="flex items-center sm:justify-end">
            <Button
              size="lg"
              className="px-8 w-full sm:w-fit"
              onClick={() => setIsRegisterModalOpen(true)}
            >
              Register a Group
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Register Group Modal */}
      <Dialog
        open={isRegisterModalOpen}
        onOpenChange={(open) => {
          setIsRegisterModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-7xl max-h-[80vh] overflow-scroll">
          <DialogHeader>
            <DialogTitle>Register a New Group</DialogTitle>
            <DialogDescription>
              Fill out the form to register your group for this event
            </DialogDescription>
          </DialogHeader>
          {event && (
            <GroupForm
              event={event}
              onSubmit={async (values) => {
                await handleRegisterGroup(values);
                setIsRegisterModalOpen(false);
              }}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
