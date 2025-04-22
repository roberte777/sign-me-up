import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Landing() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Sign Me Up</CardTitle>
          <CardDescription>
            Create and manage event registrations with ease
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sign Me Up is a simple solution for creating events and handling
            group registrations. No accounts needed - just create an event and
            share the link.
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/create" className="w-full">
            <Button className="w-full">Create Event</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
