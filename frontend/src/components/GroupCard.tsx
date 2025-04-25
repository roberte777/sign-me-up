import { Group } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { BriefcaseIcon, EditIcon, UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

type GroupCardProps = { group: Group; handleEditGroup: (group: Group) => void };
export function GroupCard({ group, handleEditGroup }: GroupCardProps) {
  return (
    <Card key={group.id} className="overflow-hidden h-full flex flex-col">
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
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-xl">{group.group_name}</CardTitle>
        <CardDescription className="mt-1 flex items-center gap-1">
          <UsersIcon className="h-3.5 w-3.5" />
          <span>{group.members.length} members</span>
        </CardDescription>
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
    </Card>
  );
}
