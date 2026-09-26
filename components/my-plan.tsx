"use client";

import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useFitLog } from "@/components/fitlog-provider";
import { LoadingWorkouts } from "@/components/loading-workouts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutImage } from "@/components/workout-image";
import { WorkoutStats } from "@/components/workout-stats";
import type { Workout } from "@/lib/workout";

type PlanTab = "plan" | "saved";
type SortBy = "duration" | "calories" | "rating";
type WorkoutRow = { workout: Workout; done: boolean };

function sortRows(rows: WorkoutRow[], sortBy: SortBy): WorkoutRow[] {
  return [...rows].sort((a, b) => {
    if (sortBy === "calories") {
      return b.workout.caloriesBurned - a.workout.caloriesBurned;
    }
    if (sortBy === "rating") {
      return b.workout.rating - a.workout.rating;
    }
    return a.workout.duration - b.workout.duration;
  });
}

function PlanEmpty() {
  return (
    <div className="plan-empty-card" role="region" aria-label="Empty workout list">
      <h2 className="plan-empty-heading">Nothing here yet</h2>
      <p className="plan-empty-subtext">
        Browse the library and add a lift to get today moving.
      </p>
      <Link href="/" className="plan-empty-action">
        Go to workouts
      </Link>
    </div>
  );
}

function PlanRowItem({
  workout,
  done,
  tab,
}: WorkoutRow & { tab: PlanTab }) {
  const { markDone, removeFromPlan, removeSaved } = useFitLog();
  const href = `/workouts/${encodeURIComponent(workout.id)}`;

  return (
    <li>
      <Card className="plan-row-card" role="group" aria-label={workout.name}>
        <div className="plan-row-left">
          <Link
            href={href}
            className="plan-row-thumb block"
            aria-hidden="true"
            tabIndex={-1}
          >
            <WorkoutImage
              src={workout.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </Link>
          <div className="plan-row-details">
            <h2 className="plan-row-title">
              <Link href={href}>{workout.name}</Link>
            </h2>
            <p className="plan-row-equipment">{workout.equipment}</p>
            <WorkoutStats workout={workout} accent />
          </div>
        </div>

        <div className="plan-row-actions">
          <Link href={href} className="plan-row-details-btn">
            View Details
          </Link>

          {tab === "plan" && (
            <Button
              className="plan-row-done-btn"
              onClick={() => markDone(workout.id)}
              disabled={done}
              aria-label={done ? `${workout.name} is completed` : `Mark ${workout.name} as done`}
            >
              <Check className="size-3.5" aria-hidden="true" />
              <span>{done ? "Done" : "Mark as Done"}</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="plan-row-remove-btn"
            onClick={() =>
              tab === "plan" ? removeFromPlan(workout.id) : removeSaved(workout.id)
            }
            aria-label={`Remove ${workout.name} from ${tab === "plan" ? "today's plan" : "saved"}`}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </li>
  );
}

export function MyPlan({ workouts }: { workouts: Workout[] }) {
  const { ready, plan, saved } = useFitLog();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab: PlanTab = searchParams.get("tab") === "saved" ? "saved" : "plan";
  const [sortBy, setSortBy] = useState<SortBy>("duration");

  const catalog = new Map(workouts.map((workout) => [workout.id, workout]));

  const planRows: WorkoutRow[] = plan.map((entry) => ({
    ...entry,
    workout: catalog.get(entry.workout.id) ?? entry.workout,
  }));

  const savedRows: WorkoutRow[] = saved.map((item) => ({
    workout: catalog.get(item.id) ?? item,
    done: false,
  }));

  // Exercises, Minutes, Calories totals reflect all planned workouts (including completed)
  const totalExercises = planRows.length;
  const totalMinutes = planRows.reduce(
    (total, entry) => total + entry.workout.duration,
    0
  );
  const totalCalories = planRows.reduce(
    (total, entry) => total + entry.workout.caloriesBurned,
    0
  );

  function handleTabChange(value: string) {
    const nextTab = value === "saved" ? "saved" : "plan";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  if (!ready) {
    return <LoadingWorkouts variant="plan" />;
  }

  return (
    <div className="site-container py-8 sm:py-12">
      <header className="plan-page-header">
        <h1 className="plan-page-title">My Plan</h1>
        <p className="plan-page-subtitle">
          Cap of five lifts for today. Finish them, then load more.
        </p>
      </header>

      {/* Metrics Summary Panel */}
      <Card className="plan-summary-card" aria-label="Plan summary metrics" aria-live="polite">
        <div className="plan-summary-metric">
          <span className="plan-metric-title">Exercises</span>
          <span className="plan-metric-number plan-metric-number-accent">
            {totalExercises}
          </span>
        </div>
        <div className="plan-summary-metric">
          <span className="plan-metric-title">Minutes</span>
          <span className="plan-metric-number">{totalMinutes}</span>
        </div>
        <div className="plan-summary-metric">
          <span className="plan-metric-title">Calories</span>
          <span className="plan-metric-number">{totalCalories}</span>
        </div>
      </Card>

      {/* Tabs and Toolbar */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="plan-toolbar">
          <TabsList className="plan-tabs-list" aria-label="Workout plan views">
            <TabsTrigger value="plan" className="plan-tab-trigger">
              Today&apos;s Plan
            </TabsTrigger>
            <TabsTrigger value="saved" className="plan-tab-trigger">
              Saved
            </TabsTrigger>
          </TabsList>

          {/* Sort By Dropdown */}
          <div className="plan-sort-wrapper">
            <span className="text-muted-foreground text-xs sm:text-sm font-medium">Sort By</span>
            <Select
              value={sortBy}
              onValueChange={(val) => {
                if (val === "duration" || val === "calories" || val === "rating") {
                  setSortBy(val);
                }
              }}
            >
              <SelectTrigger
                aria-label="Sort workouts by"
                className="w-32 h-9 rounded-full bg-secondary border-border text-xs sm:text-sm text-foreground focus:ring-1 focus:ring-ring"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-foreground">
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="calories">Calories</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tab Contents */}
        <TabsContent value="plan" className="mt-0 outline-none">
          {planRows.length === 0 ? (
            <PlanEmpty />
          ) : (
            <ul className="plan-list-wrap" aria-label="Today's planned workouts">
              {sortRows(planRows, sortBy).map((entry) => (
                <PlanRowItem
                  key={entry.workout.id}
                  workout={entry.workout}
                  done={entry.done}
                  tab="plan"
                />
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-0 outline-none">
          {savedRows.length === 0 ? (
            <PlanEmpty />
          ) : (
            <ul className="plan-list-wrap" aria-label="Saved workouts">
              {sortRows(savedRows, sortBy).map((entry) => (
                <PlanRowItem
                  key={entry.workout.id}
                  workout={entry.workout}
                  done={false}
                  tab="saved"
                />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
