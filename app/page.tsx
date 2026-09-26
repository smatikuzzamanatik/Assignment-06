import { Suspense } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

import { LoadingWorkouts } from "@/components/loading-workouts";
import { WorkoutLibrary } from "@/components/workout-library";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="site-container py-8 sm:py-12">
      {/* Hero Card */}
      <Card className="hero-card">
        <div className="hero-content">
          <p className="hero-eyebrow">Workout Library</p>
          <h1 className="hero-title">Train with intent. Log every set.</h1>
          <p className="hero-description">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into
            today&apos;s plan, and watch the week&apos;s work add up.
          </p>
          <a href="#library" className="hero-cta-btn">
            <span>Browse workouts</span>
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
        <div className="hero-visual">
          <Image
            src="/assets/banner.png"
            alt="Anatomical illustration of an athlete performing a preacher curl"
            width={520}
            height={380}
            priority
            className="hero-image"
          />
        </div>
      </Card>

      {/* Library Section */}
      <section
        id="library"
        className="library-section"
        aria-labelledby="library-title"
      >
        <header className="library-header">
          <h2 id="library-title" className="library-title">
            The Library
          </h2>
          <p className="library-subtitle">
            Twelve lifts covering every major muscle group.
          </p>
        </header>

        <Suspense fallback={<LoadingWorkouts variant="library" />}>
          <WorkoutLibrary />
        </Suspense>
      </section>
    </div>
  );
}
