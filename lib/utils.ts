import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React, { useRef } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleScroll(ref: React.RefObject<HTMLInputElement | null>) {
    return () => {
      ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
  };
};
