import { useState, useEffect, useCallback } from "react";
import { useParams } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventAPI, GroupAPI, type Event, type Group } from "@/lib/api";
import { List, LayoutGrid, Users, Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { GroupAccordion } from "./GroupAccordion";
import { EventDetails } from "./EventDetails";
import { GroupCard } from "./GroupCard";

export function EventView() {
  const { eventId } = useParams({ from: "/event/$eventId/" });
  const [event, setEvent] = useState<Event | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  // UI enhancement states
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate total participants
  const totalParticipants = groups.reduce((total, group) => total + (group.members?.length || 0), 0);

  const fetchGroups = useCallback(async () => {
    try {
      const groupsData = await GroupAPI.getGroups(eventId);
      setGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, [eventId]);

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
  }, [eventId, fetchGroups]);

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
  return (
    <div className="bg-gradient-to-b from-background to-background/90 flex flex-col">
      <div className="container flex-1 sm:py-6 space-y-8">
        {/* Event Details Card */}
        <EventDetails
          eventId={eventId}
          event={event}
          totalParticipants={totalParticipants}
        />

        {/* Groups Table */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="hidden sm:block text-xl font-semibold">
            Registered Groups
          </h2>

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

        <ScrollArea className="h-[calc(100vh-600px)] pr-3 overflow-hidden">
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
                  eventId={eventId}
                  onDeleteSuccess={fetchGroups}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  eventId={eventId}
                  onDeleteSuccess={fetchGroups}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
