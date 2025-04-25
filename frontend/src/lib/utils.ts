import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    // Format the date using Intl.DateTimeFormat for better localization
    return new Intl.DateTimeFormat("default", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original if parsing fails
  }
};
