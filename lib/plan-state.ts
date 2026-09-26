import { isWorkout, type Workout } from "./workout.ts";

export const MAX_UNFINISHED_WORKOUTS = 5;
export const PLAN_STORAGE_KEY = "fitlog:plan:v1";

export interface PlanEntry {
  workout: Workout;
  done: boolean;
}

export interface PlanState {
  plan: PlanEntry[];
  saved: Workout[];
}

export type WorkoutSort = "duration" | "calories" | "rating";

export type PlanAction =
  | { type: "add"; workout: Workout }
  | { type: "save"; workout: Workout }
  | { type: "done"; id: number }
  | { type: "remove-plan"; id: number }
  | { type: "remove-saved"; id: number };

export type PlanOutcome =
  | "added"
  | "saved"
  | "completed"
  | "removed-plan"
  | "removed-saved"
  | "duplicate-plan"
  | "duplicate-saved"
  | "at-capacity"
  | "unchanged";

export function createEmptyPlanState(): PlanState {
  return { plan: [], saved: [] };
}

/** Each action is atomic, keeping duplicate/cap checks safe for rapid clicks. */
export function updatePlanState(
  state: PlanState,
  action: PlanAction,
): { state: PlanState; outcome: PlanOutcome } {
  switch (action.type) {
    case "add": {
      if (state.plan.some(({ workout }) => workout.id === action.workout.id)) {
        return { state, outcome: "duplicate-plan" };
      }
      if (state.plan.filter(({ done }) => !done).length >= MAX_UNFINISHED_WORKOUTS) {
        return { state, outcome: "at-capacity" };
      }
      return {
        state: {
          ...state,
          plan: [...state.plan, { workout: action.workout, done: false }],
        },
        outcome: "added",
      };
    }
    case "save": {
      if (state.saved.some(({ id }) => id === action.workout.id)) {
        return { state, outcome: "duplicate-saved" };
      }
      return {
        state: { ...state, saved: [...state.saved, action.workout] },
        outcome: "saved",
      };
    }
    case "done": {
      if (!state.plan.some(({ workout, done }) => workout.id === action.id && !done)) {
        return { state, outcome: "unchanged" };
      }
      return {
        state: {
          ...state,
          plan: state.plan.map((entry) =>
            entry.workout.id === action.id ? { ...entry, done: true } : entry,
          ),
        },
        outcome: "completed",
      };
    }
    case "remove-plan": {
      const plan = state.plan.filter(({ workout }) => workout.id !== action.id);
      return plan.length === state.plan.length
        ? { state, outcome: "unchanged" }
        : { state: { ...state, plan }, outcome: "removed-plan" };
    }
    case "remove-saved": {
      const saved = state.saved.filter(({ id }) => id !== action.id);
      return saved.length === state.saved.length
        ? { state, outcome: "unchanged" }
        : { state: { ...state, saved }, outcome: "removed-saved" };
    }
  }
}

export function getPlanTotals(plan: PlanEntry[]) {
  return plan.reduce(
    (totals, { workout }) => ({
      exercises: totals.exercises + 1,
      minutes: totals.minutes + workout.duration,
      calories: totals.calories + workout.caloriesBurned,
    }),
    { exercises: 0, minutes: 0, calories: 0 },
  );
}

function compareWorkouts(a: Workout, b: Workout, sort: WorkoutSort): number {
  switch (sort) {
    case "duration":
      return a.duration - b.duration;
    case "calories":
      return b.caloriesBurned - a.caloriesBurned;
    case "rating":
      return b.rating - a.rating;
  }
}

export function sortWorkouts(workouts: Workout[], sort: WorkoutSort): Workout[] {
  return [...workouts].sort((a, b) => compareWorkouts(a, b, sort));
}

export function sortPlanEntries(entries: PlanEntry[], sort: WorkoutSort): PlanEntry[] {
  return [...entries].sort((a, b) => compareWorkouts(a.workout, b.workout, sort));
}

export function serializePlanState(state: PlanState): string {
  return JSON.stringify({ version: 1, plan: state.plan, saved: state.saved });
}

/** A corrupt or old storage value cannot break rendering or exceed the active cap. */
export function restorePlanState(serialized: string | null): PlanState {
  const empty = createEmptyPlanState();
  if (!serialized) return empty;

  try {
    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== "object") return empty;
    const data = value as Record<string, unknown>;
    if (data.version !== 1 || !Array.isArray(data.plan) || !Array.isArray(data.saved)) {
      return empty;
    }

    const plan: PlanEntry[] = [];
    const saved: Workout[] = [];
    const planIds = new Set<number>();
    const savedIds = new Set<number>();
    let unfinished = 0;

    for (const entry of data.plan) {
      if (!entry || typeof entry !== "object") continue;
      const candidate = entry as Record<string, unknown>;
      if (!isWorkout(candidate.workout) || typeof candidate.done !== "boolean") continue;
      if (planIds.has(candidate.workout.id)) continue;
      if (!candidate.done && unfinished >= MAX_UNFINISHED_WORKOUTS) continue;
      plan.push({ workout: candidate.workout, done: candidate.done });
      planIds.add(candidate.workout.id);
      if (!candidate.done) unfinished += 1;
    }

    for (const workout of data.saved) {
      if (!isWorkout(workout) || savedIds.has(workout.id)) continue;
      saved.push(workout);
      savedIds.add(workout.id);
    }

    return { plan, saved };
  } catch {
    return empty;
  }
}
