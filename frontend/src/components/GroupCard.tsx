import { useState } from "react";
import { Group, GroupAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { BriefcaseIcon, EditIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { DeleteGroupDialog } from "./DeleteGroupDialog";

type GroupCardProps = {
  group: Group;
  eventId: string;
  onDeleteSuccess?: () => void;
};

export function GroupCard({ group, eventId, onDeleteSuccess }: GroupCardProps) {
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
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <Badge
            variant="outline"
            className={
              group.accepts_others
                ? "mb-2 bg-green-500/10 text-green-500 border-green-500/20"
                : "mb-2 bg-orange-500/10 text-orange-500 border-orange-500/20"
            }
          >
            {group.accepts_others ? "Open" : "Closed"}
          </Badge>
          <CardTitle className="text-xl">{group.group_name}</CardTitle>
          <CardDescription>
            {group.members.length} members
          </CardDescription>
        </div>
        <div className="flex gap-1">
          <Link
            to="/event/$eventId/edit"
            params={{ eventId }}
            search={{ groupId: group.id }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
          >
            <EditIcon className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2Icon className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{group.creator_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs text-muted-foreground">Created by</div>
              <div className="text-sm">{group.creator_name}</div>
            </div>
          </div>

          {group.project_description && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Project</div>
              <div className="flex items-center gap-1.5">
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{group.project_description}</span>
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-muted-foreground mb-1">Members</div>
            <div className="flex -space-x-2 overflow-hidden">
              {group.members.slice(0, 3).map((member, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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

      {/* Delete Group Dialog */}
      <DeleteGroupDialog
        group={group}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteGroup}
      />
    </Card>
  );
}
