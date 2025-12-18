import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx to handle conditional classes and tailwind-merge to deduplicate classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
