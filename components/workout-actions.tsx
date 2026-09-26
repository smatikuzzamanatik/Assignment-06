"use client";

import { Bookmark, CalendarPlus, Check } from "lucide-react";

import { useFitLog } from "@/components/fitlog-provider";
import { Button } from "@/components/ui/button";
import { MAX_UNFINISHED_WORKOUTS, type PlanEntry } from "@/lib/plan-state";
import type { Workout } from "@/lib/workout";

export function WorkoutActions({ workout }: { workout: Workout }) {
  const { ready, plan, saved, addToPlan, saveWorkout } = useFitLog();

  const isPlanned = plan.some((entry: PlanEntry) => entry.workout.id === workout.id);
  const isSaved = saved.some((item: Workout) => item.id === workout.id);
  const unfinishedCount = plan.filter((entry: PlanEntry) => !entry.done).length;
  const isPlanFull = unfinishedCount >= MAX_UNFINISHED_WORKOUTS;

  return (
    <div className="flex flex-col gap-2 pt-2">
      <div className="detail-actions-row">
        <Button
          className="btn-pill-primary"
          disabled={!ready || isPlanned || isPlanFull}
          onClick={() => addToPlan(workout)}
          aria-label={
            isPlanned
              ? `${workout.name} is already in today's plan`
              : `Add ${workout.name} to today's plan`
          }
        >
          {isPlanned ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <CalendarPlus className="size-4" aria-hidden="true" />
          )}
          <span>{isPlanned ? "In today's plan" : "Add to today's plan"}</span>
        </Button>

        <Button
          variant="outline"
          className="btn-pill-secondary"
          disabled={!ready || isSaved}
          onClick={() => saveWorkout(workout)}
          aria-label={
            isSaved
              ? `${workout.name} is saved for later`
              : `Save ${workout.name} for later`
          }
        >
          {isSaved ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Bookmark className="size-4" aria-hidden="true" />
          )}
          <span>{isSaved ? "Saved for later" : "Save for later"}</span>
        </Button>
      </div>

      {isPlanFull && !isPlanned && (
        <p className="text-xs text-muted-foreground mt-1" role="status">
          Your plan has five unfinished lifts. Finish or remove one to add more.
        </p>
      )}
    </div>
  );
}
