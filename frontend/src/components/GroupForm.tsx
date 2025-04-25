"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { PlusCircle, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type GroupFormValues, groupSchema } from "@/lib/schemas";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Event, Group } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";

interface GroupFormProps {
  event: Event;
  existingGroup?: Group;
  onSubmit: (values: GroupFormValues) => Promise<void>;
  isLoading: boolean;
}

async function submitWrapper(
  onSubmit: (values: GroupFormValues) => Promise<void>,
) {
  return async (values: GroupFormValues) => {
    const leader = { name: values.creator_name, email: values.creator_email };
    values.members.push(leader);
    await onSubmit(values);
  };
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
  const navigate = useNavigate({ from: "/event/$eventId/register" });

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
          members: [],
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
      <form
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const leader = {
              name: values.creator_name,
              email: values.creator_email,
            };
            values.members.push(leader);
            await onSubmit(values);
            // Only navigate on successful validation and submission
            navigate({ to: "/event/$eventId", params: { eventId: event.id } });
          } catch (e) {
            console.error(e);
          }
        })}
        className="space-y-8"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Group Information</h3>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="creator_name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel className="font-medium">
                      Your Name <span className="text-destructive">*</span>
                    </FormLabel>
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
                  <FormItem className="grid gap-2">
                    <FormLabel className="font-medium">
                      Your Email <span className="text-destructive">*</span>
                    </FormLabel>
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
                  <FormItem className="grid gap-2">
                    <FormLabel className="font-medium">
                      Group Name <span className="text-destructive">*</span>
                    </FormLabel>
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
                  <FormItem className="grid gap-2">
                    <FormLabel className="font-medium">
                      Project Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project (optional)"
                        className="min-h-[100px] resize-none"
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
                  <FormItem className="flex items-center space-x-2 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-medium cursor-pointer">
                      Open to additional members
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="hidden md:block" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Group Members</h3>
              <span className="text-sm text-muted-foreground">
                {memberCount} / {event.group_size_limit} members
              </span>
            </div>

            {/* Group Leader Card */}
            <Card className="p-4 border bg-muted/40">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-primary" />
                <div className="font-medium">
                  {form.watch("creator_name") || "You"} (Group Leader)
                </div>
              </div>
              <div className="text-sm text-muted-foreground pl-8">
                {form.watch("creator_email") || "Your email will appear here"}
              </div>
            </Card>

            {/* Member Cards */}
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 border">
                <div className="flex items-center justify-between mb-4">
                  {/*using index + 2 becuase the group leader is not put into the members list until the form is submitted*/}
                  <div className="font-medium">Member {index + 2}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    <span className="sr-only">Remove member</span>
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`members.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Name</FormLabel>
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
                        <FormLabel className="text-sm">
                          Email (Optional)
                        </FormLabel>
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
              </Card>
            ))}

            {/* Add Member Button */}
            {memberCount < event.group_size_limit && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddMember}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            )}
          </div>
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
