import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  EventAPI,
  GroupAPI,
  type Event,
  type Group,
  type CreateGroupData,
} from "@/lib/api";
import { GroupForm } from "@/components/GroupForm";
import type { GroupFormValues } from "@/lib/schemas";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Edit,
  List,
  LayoutGrid,
  MapPin,
  Users,
  Briefcase,
  Search,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

// Custom accordion component for group display
function GroupAccordion({
  group,
  isOpen,
  onToggle,
  onEdit,
}: {
  group: Group;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="border rounded-lg mb-4">
      {/* Accordion Header - entire header is clickable */}
      <div
        className="bg-muted/30 p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={
              group.accepts_others
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-orange-500/10 text-orange-500 border-orange-500/20"
            }
          >
            {group.accepts_others ? "Open" : "Closed"}
          </Badge>
          <h3 className="font-medium">{group.group_name}</h3>
          <span className="text-sm text-muted-foreground">
            {group.members.length} members
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent accordion toggle when clicking edit
              onEdit();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation(); // Prevent double toggle
              onToggle();
            }}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
            <span className="sr-only">Toggle group details</span>
          </Button>
        </div>
      </div>

      {/* Accordion Content */}
      <div
        className={`accordion-content overflow-scroll transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t bg-card">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Created by
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {group.creator_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{group.creator_name}</span>
              </div>
            </div>
            {group.project_description && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Project
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{group.project_description}</span>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div>
            <h4 className="text-sm font-medium mb-3">Members:</h4>
            <div className="space-y-2">
              {group.members.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {member.email || "-"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventView() {
  const { eventId } = useParams({ from: "/event/$eventId" });
  const [event, setEvent] = useState<Event | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // UI enhancement states
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

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

  // Toggle expansion state for a group
  const toggleGroupExpansion = (groupId: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Check if a group is expanded
  const isGroupExpanded = (groupId: number) => !!expandedGroups[groupId];

  // Filter groups based on search and status
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      searchQuery === "" ||
      group.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.creator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.project_description &&
        group.project_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && group.accepts_others) ||
      (statusFilter === "closed" && !group.accepts_others);

    return matchesSearch && matchesStatus;
  });

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
    <>
      <div className="bg-gradient-to-b from-background to-background/90 flex flex-col">
        <div className="container flex-1 sm:py-6 space-y-8">
          {/* Event Details Card */}
          <Card className="shadow-md bg-card/50 backdrop-blur-sm event-card">
            <CardContent className="flex flex-col space-y-3 sm:grid sm:gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(event.date_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
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
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Groups Table */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Registered Groups</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search groups..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-3">
                <Select
                  defaultValue="all"
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-750px)] pr-3">
            {filteredGroups.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users
                    className="h-12 w-12 text-muted-foreground mb-4"
                    strokeWidth={1.5}
                  />
                  <p className="text-muted-foreground text-center">
                    {groups.length === 0
                      ? "No groups have registered yet. Be the first!"
                      : "No groups match your search criteria."}
                  </p>
                  {groups.length === 0 && (
                    <Button
                      className="mt-4"
                      onClick={() => setIsRegisterModalOpen(true)}
                    >
                      Register a Group
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : viewMode === "list" ? (
              <div>
                {filteredGroups.map((group) => (
                  <GroupAccordion
                    key={group.id}
                    group={group}
                    isOpen={isGroupExpanded(group.id)}
                    onToggle={() => toggleGroupExpansion(group.id)}
                    onEdit={() => handleEditGroup(group)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="overflow-hidden h-full flex flex-col"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="outline"
                          className={
                            group.accepts_others
                              ? "bg-green-500/10 text-green-500 border-green-500/20 mb-2"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20 mb-2"
                          }
                        >
                          {group.accepts_others ? "Open" : "Closed"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-xl">
                        {group.group_name}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{group.members.length} members</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 flex-grow">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {group.creator_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Created by
                            </div>
                            <div className="text-sm">{group.creator_name}</div>
                          </div>
                        </div>

                        {group.project_description && (
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Project
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {group.project_description}
                              </span>
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="text-xs text-muted-foreground mb-1">
                            Members
                          </div>
                          <div className="flex -space-x-2 overflow-hidden">
                            {group.members.slice(0, 3).map((member, i) => (
                              <Avatar
                                key={i}
                                className="h-8 w-8 border-2 border-background"
                              >
                                <AvatarFallback>
                                  {member.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {group.members.length > 3 && (
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                                +{group.members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
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
        <DialogContent className="sm:max-w-7xl max-h-[80vh] overflow-scroll">
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
//
