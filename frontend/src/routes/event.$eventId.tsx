import { createFileRoute } from "@tanstack/react-router";
import { EventView } from "@/components/EventView";

export const Route = createFileRoute("/event/$eventId")({
  component: EventView,
});
