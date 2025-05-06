import { useState, useEffect } from "react";
import { Group } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTitle } from "./ui/alert";

interface DeleteGroupDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteGroupDialog({
  group,
  open,
  onOpenChange,
  onConfirm,
}: DeleteGroupDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset error and confirm text when dialog opens/closes
  useEffect(() => {
    if (open) {
      setError(null);
      setConfirmText("");
    }
  }, [open]);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete group:", error);
      setError("Failed to delete group. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Group
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the group
            "{group.group_name}" and remove all members from it.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Uh Oh!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            To confirm, type the name of the group: <strong>{group.group_name}</strong>
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type group name to confirm"
            className="w-full"
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== group.group_name || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 