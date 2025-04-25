import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClockIcon, UsersIcon, ZapIcon } from "lucide-react";

export function Landing() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create and manage events{" "}
            <span className="text-purple-500">effortlessly</span>
          </h2>
          <p className="text-lg text-gray-300">
            The simplest way to organize events and handle registrations without
            the complexity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mb-12">
          <div className="flex items-start gap-3">
            <div className="text-purple-500 mt-1">
              <UsersIcon size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                No accounts needed
              </h3>
              <p className="text-gray-400 text-sm">
                Just create and share your event link
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-purple-500 mt-1">
              <ZapIcon size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Simple event creation
              </h3>
              <p className="text-gray-400 text-sm">
                Set up your event in minutes with our intuitive interface
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-purple-500 mt-1">
              <ClockIcon size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Real-time updates
              </h3>
              <p className="text-gray-400 text-sm">
                Track registrations as they happen
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/create"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Create Your Event
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
