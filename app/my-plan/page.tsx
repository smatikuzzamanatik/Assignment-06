import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadingWorkouts } from "@/components/loading-workouts";
import { MyPlan } from "@/components/my-plan";
import { getWorkouts } from "@/lib/workouts";

export const metadata: Metadata = {
  title: "My Plan | FitLog",
  description: "Your planned and saved workouts, all in one place.",
};

export const dynamic = "force-dynamic";

export default async function MyPlanPage() {
  const workouts = await getWorkouts();

  return (
    <Suspense fallback={<LoadingWorkouts variant="plan" />}>
      <MyPlan workouts={workouts} />
    </Suspense>
  );
}
