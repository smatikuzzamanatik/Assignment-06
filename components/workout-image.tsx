"use client";

import Image from "next/image";
import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function WorkoutImage({
  src,
  alt,
  className,
  priority = false,
}: WorkoutImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-center bg-secondary text-muted-foreground",
          className
        )}
        role="img"
        aria-label={alt || "Workout illustration"}
      >
        <Dumbbell className="size-8 text-primary/40 mb-1" aria-hidden="true" />
        <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
          FitLog Media
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
