import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface LoadingWorkoutsProps {
  variant?: "library" | "plan" | "detail";
}

export function LoadingWorkouts({ variant = "library" }: LoadingWorkoutsProps) {
  if (variant === "detail") {
    return (
      <div className="site-container detail-layout" aria-label="Loading workout details">
        <div className="detail-media-col">
          <Skeleton className="w-full aspect-square sm:aspect-[4/4.5] rounded-2xl bg-secondary" />
        </div>
        <div className="detail-info-col space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 rounded-lg bg-secondary" />
            <Skeleton className="h-5 w-full rounded-md bg-secondary" />
            <Skeleton className="h-5 w-4/5 rounded-md bg-secondary" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full bg-secondary" />
              <Skeleton className="h-6 w-16 rounded-full bg-secondary" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-xl bg-secondary" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-md bg-secondary" />
            <Skeleton className="h-4 w-full rounded-md bg-secondary" />
            <Skeleton className="h-4 w-5/6 rounded-md bg-secondary" />
            <Skeleton className="h-4 w-4/6 rounded-md bg-secondary" />
          </div>
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-12 w-44 rounded-full bg-secondary" />
            <Skeleton className="h-12 w-36 rounded-full bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "plan") {
    return (
      <div className="site-container py-8" aria-label="Loading workout plan">
        <div className="plan-page-header">
          <Skeleton className="h-10 w-48 rounded-lg bg-secondary mb-2" />
          <Skeleton className="h-4 w-72 rounded-md bg-secondary" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl bg-secondary mb-8" />
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-52 rounded-full bg-secondary" />
          <Skeleton className="h-10 w-32 rounded-lg bg-secondary" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  // Variant library
  return (
    <div className="w-full" aria-label="Loading workout library">
      <div className="flex items-center justify-center gap-3 py-6 text-muted-foreground text-sm">
        <Spinner className="size-5 text-primary" />
        <span>Loading workouts...</span>
      </div>
      <div className="workout-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="workout-card border border-border bg-card">
            <Skeleton className="w-full aspect-[16/10] bg-secondary" />
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full bg-secondary" />
                <Skeleton className="h-5 w-14 rounded-full bg-secondary" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-md bg-secondary" />
              <Skeleton className="h-4 w-1/2 rounded-md bg-secondary" />
              <div className="pt-3 border-t border-border flex justify-between">
                <Skeleton className="h-4 w-12 rounded bg-secondary" />
                <Skeleton className="h-4 w-14 rounded bg-secondary" />
                <Skeleton className="h-4 w-8 rounded bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
