import { createFileRoute } from "@tanstack/react-router";
import { CreateEvent } from "@/components/CreateEvent";

export const Route = createFileRoute("/create")({
  component: CreateEvent,
});
