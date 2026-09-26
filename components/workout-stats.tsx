import { Clock, Flame, Star } from "lucide-react";
import type { Workout } from "@/lib/workout";
import { cn } from "@/lib/utils";

interface WorkoutStatsProps {
  workout: Pick<Workout, "duration" | "caloriesBurned" | "rating">;
  accent?: boolean;
  className?: string;
}

export function WorkoutStats({ workout, accent = false, className }: WorkoutStatsProps) {
  const iconClass = accent ? "workout-stat-icon-accent" : "workout-stat-icon";

  return (
    <div className={cn("workout-card-stats", className)}>
      <div className="workout-stat-item">
        <Clock className={iconClass} aria-hidden="true" />
        <span>{workout.duration} min</span>
      </div>
      <div className="workout-stat-item">
        <Flame className={iconClass} aria-hidden="true" />
        <span>{workout.caloriesBurned} kcal</span>
      </div>
      <div className="workout-stat-item">
        <Star className={iconClass} aria-hidden="true" />
        <span>{workout.rating}</span>
      </div>
    </div>
  );
}
