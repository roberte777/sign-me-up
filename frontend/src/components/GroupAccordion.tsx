import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Group, GroupAPI } from "@/lib/api";
import { ChevronDown, Edit, Briefcase, Trash2, UsersIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { DeleteGroupDialog } from "./DeleteGroupDialog";

// Custom accordion component for group display
export function GroupAccordion({
  group,
  isOpen,
  onToggle,
  eventId,
  onDeleteSuccess,
}: {
  group: Group;
  isOpen: boolean;
  onToggle: () => void;
  eventId: string;
  onDeleteSuccess?: () => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteGroup = async () => {
    try {
      await GroupAPI.deleteGroup(group.id);
      // Call the callback if provided, otherwise fall back to page navigation
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        navigate({ to: "/event/$eventId", params: { eventId }, replace: true });
      }
    } catch (error) {
      console.error("Failed to delete group:", error);
      // Rethrow the error so it can be caught by the dialog
      throw error;
    }
  };

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
        </div>
        <div className="flex items-center sm:gap-2">
          <div className="text-sm font-medium inline-flex h-8 items-center justify-center px-3 py-1.5">
          <UsersIcon className="h-4 w-4 mr-2"/>
          <span>{group.members.length}</span>
          </div>
          <Link
            to="/event/$eventId/edit"
            params={{ eventId }}
            search={{ groupId: group.id }}
            onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
            className="text-sm font-medium inline-flex h-8 items-center justify-center rounded-md bg-transparent px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Edit className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:block">
            Edit
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation(); // Prevent accordion toggle
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete group</span>
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
        className={`accordion-content transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "max-h-0 opacity-0"
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

      {/* Delete Group Dialog */}
      <DeleteGroupDialog
        group={group}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteGroup}
      />
    </div>
  );
}
