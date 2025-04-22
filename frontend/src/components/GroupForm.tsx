import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GroupFormValues, groupSchema } from "@/lib/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Event, Group } from "@/lib/api";

interface GroupFormProps {
  event: Event;
  existingGroup?: Group;
  onSubmit: (values: GroupFormValues) => Promise<void>;
  isLoading: boolean;
}

export function GroupForm({
  event,
  existingGroup,
  onSubmit,
  isLoading,
}: GroupFormProps) {
  const [memberCount, setMemberCount] = useState(
    existingGroup?.members.length || 1,
  );

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: existingGroup
      ? {
          creator_name: existingGroup.creator_name,
          creator_email: existingGroup.creator_email,
          group_name: existingGroup.group_name,
          accepts_others: existingGroup.accepts_others,
          project_description: existingGroup.project_description || "",
          members: existingGroup.members.map((m) => ({
            name: m.name,
            email: m.email || "",
          })),
        }
      : {
          creator_name: "",
          creator_email: "",
          group_name: "",
          accepts_others: false,
          project_description: "",
          members: [{ name: "", email: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const handleAddMember = () => {
    if (memberCount < event.group_size_limit) {
      append({ name: "", email: "" });
      setMemberCount((prev) => prev + 1);
    }
  };

  const handleRemoveMember = (index: number) => {
    if (memberCount > 1) {
      remove(index);
      setMemberCount((prev) => prev - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Group Information</h3>

          <FormField
            control={form.control}
            name="creator_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="creator_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  We'll use this to contact you about your group.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="group_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter group name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe your project (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accepts_others"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Open to additional members
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">Group Members</h3>
            <div className="text-sm text-muted-foreground">
              {memberCount} / {event.group_size_limit} members
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Member {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`members.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter member name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`members.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter member email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {memberCount < event.group_size_limit && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddMember}
                >
                  Add Member
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? "Submitting..."
            : existingGroup
              ? "Update Group"
              : "Register Group"}
        </Button>
      </form>
    </Form>
  );
}
