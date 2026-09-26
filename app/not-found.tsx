import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <div className="site-container py-24 sm:py-32 flex flex-col items-center justify-center text-center gap-6">
      <div className="relative size-16 rounded-full bg-secondary border border-border flex items-center justify-center">
        <Dumbbell className="size-8 text-primary" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <p className="font-heading text-6xl sm:text-7xl font-black text-primary tracking-tight">
          404
        </p>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-foreground">
          Page or Lift Not Found
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The workout or page you are looking for does not exist or has been removed from the library.
        </p>
      </div>

      <Link href="/" className="hero-cta-btn">
        Return to Workouts
      </Link>
    </div>
  );
}
