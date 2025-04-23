import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventAPI, GroupAPI, Event, Group, CreateGroupData } from "@/lib/api";
import { GroupForm } from "@/components/GroupForm";
import { GroupFormValues } from "@/lib/schemas";

export function EventView() {
  const { eventId } = useParams({ from: "/event/$eventId" });
  const [event, setEvent] = useState<Event | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("register");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await EventAPI.getEvent(eventId);
        setEvent(eventData);
        await fetchGroups();
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  const fetchGroups = async () => {
    try {
      const groupsData = await GroupAPI.getGroups(eventId);
      console.log(groupsData);
      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  const handleRegisterGroup = async (values: GroupFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
      const groupData: CreateGroupData = {
        ...values,
        event_id: eventId,
      };
      await GroupAPI.createGroup(groupData);
      await fetchGroups();
      setIsDialogOpen(false);
      setActiveTab("participants");
    } catch (error) {
      console.error("Failed to register group:", error);
      alert("Failed to register group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGroup = async (values: GroupFormValues) => {
    if (!selectedGroup) return;

    setIsLoading(true);
    try {
      await GroupAPI.updateGroup(selectedGroup.id, values);
      await fetchGroups();
      setIsDialogOpen(false);
      setSelectedGroup(null);
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update group:", error);
      alert("Failed to update group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  if (!event) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading event details...</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
          <CardDescription>
            <div className="space-y-1">
              <p>
                <strong>Date:</strong> {formatDate(event.date_time)}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Maximum Group Size:</strong> {event.group_size_limit}
              </p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register a Group</TabsTrigger>
          <TabsTrigger value="participants">Registered Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Register Your Group</CardTitle>
              <CardDescription>
                Fill out the form to register your group for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {event && (
                <GroupForm
                  event={event}
                  onSubmit={handleRegisterGroup}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registered Groups</CardTitle>
              <CardDescription>
                All the groups registered for this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No groups have registered yet. Be the first!
                </p>
              ) : (
                <div className="space-y-6">
                  {groups.map((group) => (
                    <Card key={group.id} className="overflow-hidden">
                      <CardHeader className="bg-muted pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl">
                            {group.group_name}
                          </CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditGroup(group)}
                          >
                            Edit Group
                          </Button>
                        </div>
                        <CardDescription>
                          <p>
                            <strong>Created by:</strong> {group.creator_name}
                          </p>
                          {group.project_description && (
                            <p>
                              <strong>Project:</strong>{" "}
                              {group.project_description}
                            </p>
                          )}
                          <p>
                            <strong>Status:</strong>{" "}
                            {group.accepts_others
                              ? "Open to new members"
                              : "Closed"}
                          </p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <h4 className="text-sm font-medium mb-2">
                          Members ({group.members.length}):
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.members.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.email || "-"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Group Dialog */}
      <Dialog
        open={isDialogOpen && isEditMode}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedGroup(null);
            setIsEditMode(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update your group information</DialogDescription>
          </DialogHeader>
          {event && selectedGroup && (
            <GroupForm
              event={event}
              existingGroup={selectedGroup}
              onSubmit={handleUpdateGroup}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
