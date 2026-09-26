import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { WorkoutActions } from "@/components/workout-actions";
import { WorkoutImage } from "@/components/workout-image";
import { getWorkout } from "@/lib/workouts";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const workout = await getWorkout(id);
  if (!workout) return { title: "Workout Not Found | FitLog" };

  return {
    title: `${workout.name} | FitLog`,
    description: workout.description,
  };
}

export default async function WorkoutDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const workout = await getWorkout(id);

  if (!workout) notFound();

  const specifications = [
    ["EQUIPMENT", workout.equipment],
    ["DIFFICULTY", workout.difficulty],
    ["SETS", workout.sets],
    ["REPS", workout.reps],
    ["DURATION", `${workout.duration} min`],
    ["CALORIES", `${workout.caloriesBurned} kcal`],
    ["RATING", workout.rating],
  ] as const;

  return (
    <article className="site-container detail-layout">
      {/* Media Column */}
      <div className="detail-media-col">
        <div className="detail-image-box">
          <WorkoutImage
            src={workout.image}
            alt={workout.name}
            priority
            className="detail-image"
          />
        </div>
      </div>

      {/* Content Column */}
      <div className="detail-info-col">
        <header className="space-y-3">
          <h1 className="detail-name">{workout.name}</h1>
          <p className="detail-desc">{workout.description}</p>
          <div className="workout-tags-row pt-1">
            {workout.muscleGroups.map((muscle) => (
              <Badge key={muscle} className="workout-tag-badge">
                {muscle}
              </Badge>
            ))}
          </div>
        </header>

        {/* Key Specs Card */}
        <Card className="detail-specs-card">
          <div className="divide-y divide-border" role="table" aria-label="Workout specifications">
            {specifications.map(([label, value]) => (
              <div key={label} className="detail-spec-row" role="row">
                <span className="detail-spec-label" role="rowheader">
                  {label}
                </span>
                <span className="detail-spec-val" role="cell">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <section
          className="detail-instructions-section"
          aria-labelledby="instructions-heading"
        >
          <h2 id="instructions-heading" className="detail-instructions-title">
            Instructions
          </h2>
          <ol className="detail-instruction-list">
            {workout.instructions.map((step, index) => (
              <li key={`${index}-${step}`}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Actions */}
        <WorkoutActions workout={workout} />
      </div>
    </article>
  );
}
