export interface Workout {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNonnegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Validate both remote responses and locally persisted workout snapshots. */
export function isWorkout(value: unknown): value is Workout {
  if (typeof value !== "object" || value === null) return false;
  const workout = value as Record<string, unknown>;

  return (
    typeof workout.id === "number" &&
    Number.isSafeInteger(workout.id) &&
    workout.id > 0 &&
    typeof workout.name === "string" &&
    workout.name.trim().length > 0 &&
    typeof workout.image === "string" &&
    workout.image.startsWith("https://") &&
    isStringArray(workout.muscleGroups) &&
    typeof workout.equipment === "string" &&
    typeof workout.difficulty === "string" &&
    isNonnegativeNumber(workout.duration) &&
    isNonnegativeNumber(workout.caloriesBurned) &&
    isNonnegativeNumber(workout.sets) &&
    Number.isInteger(workout.sets) &&
    typeof workout.reps === "string" &&
    isNonnegativeNumber(workout.rating) &&
    workout.rating <= 5 &&
    typeof workout.description === "string" &&
    isStringArray(workout.instructions)
  );
}
