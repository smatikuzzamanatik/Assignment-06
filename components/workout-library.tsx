import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WorkoutImage } from "@/components/workout-image";
import { WorkoutStats } from "@/components/workout-stats";
import { getWorkouts } from "@/lib/workouts";

export async function WorkoutLibrary() {
  const workouts = await getWorkouts();

  return (
    <ul className="workout-grid" aria-label="Workout library">
      {workouts.map((workout) => (
        <li key={workout.id}>
          <Link
            href={`/workouts/${workout.id}`}
            className="block group h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            aria-label={`View ${workout.name}`}
          >
            <Card className="workout-card h-full">
              <div className="workout-card-image-wrap">
                <WorkoutImage
                  src={workout.image}
                  alt={workout.name}
                  className="workout-card-image"
                />
              </div>
              <div className="workout-card-body">
                <div className="workout-tags-row">
                  {workout.muscleGroups.map((muscle) => (
                    <Badge key={muscle} className="workout-tag-badge">
                      {muscle}
                    </Badge>
                  ))}
                </div>
                <h3 className="workout-card-name">{workout.name}</h3>
                <p className="workout-card-equipment">{workout.equipment}</p>
                <WorkoutStats workout={workout} />
              </div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
