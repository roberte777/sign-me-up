import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, Users } from "lucide-react";

export function Landing() {
  return (
    <div className="flex justify-center items-center">
      <div className="space-y-6">
        <div className="space-y-2 sm:text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Create and manage events{" "}
            <span className="text-purple-400">effortlessly</span>
          </h2>
          <p className="text-lg text-purple-200">
            The simplest way to organize events and handle registrations without
            the complexity
          </p>
        </div>

        <div className="space-y-4 flex-col sm:flex-row flex space-x-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-full bg-purple-800/50">
              <Users className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-medium">No accounts needed</h3>
              <p className="text-sm text-purple-300">
                Just create and share your event link
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-full bg-purple-800/50">
              <Calendar className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-medium">Simple event creation</h3>
              <p className="text-sm text-purple-300">
                Set up your event in minutes with our intuitive interface
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-full bg-purple-800/50">
              <Clock className="h-5 w-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-medium">Real-time updates</h3>
              <p className="text-sm text-purple-300">
                Track registrations as they happen
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/create">
            <Button className="w-full sm:w-fit bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-purple-700/30 transition-all hover:shadow-xl hover:shadow-purple-700/40">
              Create Your Event
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
