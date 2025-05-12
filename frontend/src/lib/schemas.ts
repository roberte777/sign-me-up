import { z } from "zod";

export const eventSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Event name must be at least 3 characters long" })
    .max(100, { message: "Event name must be at most 100 characters long" }),
  date_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time",
  }),
  group_size_limit: z
    .number()
    .int()
    .positive({ message: "Group size limit must be a positive number" })
    .min(1, { message: "Group size limit must be at least 1" })
    .max(100, { message: "Group size limit must be at most 100" }),
  max_participants: z
    .number()
    .int()
    .positive({ message: "Maximum participants must be a positive number" })
    .min(1, { message: "Maximum participants must be at least 1" })
    .max(1000, { message: "Maximum participants must be at most 1000" }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters long" })
    .max(200, { message: "Location must be at most 200 characters long" }),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const groupMemberSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .or(z.literal(""))
    .optional(),
});

export const groupSchema = z.object({
  creator_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  creator_email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  group_name: z
    .string()
    .min(2, { message: "Group name must be at least 2 characters long" })
    .max(100, { message: "Group name must be at most 100 characters long" }),
  accepts_others: z.boolean(),
  project_description: z
    .string()
    .max(500, {
      message: "Project description must be at most 500 characters long",
    })
    .optional(),
  members: z.array(groupMemberSchema).min(0),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
