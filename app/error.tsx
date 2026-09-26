"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="site-container py-24 sm:py-32 flex flex-col items-center justify-center text-center gap-4">
      <AlertCircle className="size-12 text-destructive" aria-hidden="true" />
      <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button onClick={reset} className="btn-pill-primary mt-2">
        <RotateCcw className="size-4" aria-hidden="true" />
        <span>Try again</span>
      </Button>
    </div>
  );
}
