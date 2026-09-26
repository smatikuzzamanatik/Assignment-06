"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useFitLog } from "@/components/fitlog-provider";

export function Navbar() {
  const pathname = usePathname();
  const { ready, plan, saved } = useFitLog();

  const isWorkoutsActive = pathname === "/";
  const isMyPlanActive = pathname.startsWith("/my-plan");

  const planCount = ready ? plan.length : 0;
  const savedCount = ready ? saved.length : 0;

  return (
    <header className="site-header">
      <div className="site-container navbar-inner">
        {/* Brand Logo */}
        <Link href="/" className="brand-link" aria-label="FitLog Home">
          <div className="relative size-6 shrink-0 flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt=""
              width={24}
              height={24}
              className="object-contain"
              priority
            />
          </div>
          <span className="brand-title">FITLOG</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links-cluster" aria-label="Main Navigation">
          <Link
            href="/"
            className="nav-link"
            data-active={isWorkoutsActive ? "true" : undefined}
          >
            Workouts
          </Link>
          <Link
            href="/my-plan"
            className="nav-link"
            data-active={isMyPlanActive ? "true" : undefined}
          >
            My Plan
          </Link>
        </nav>

        {/* Counter Badges */}
        <div className="header-badges-cluster">
          <Link
            href="/my-plan?tab=plan"
            className="navbar-counter-badge navbar-counter-badge-plan"
            aria-label={`Today's plan contains ${planCount} workouts`}
          >
            <span className="text-muted-foreground text-xs sm:text-sm">Plan</span>
            <span className="badge-count-pill-plan">{planCount}</span>
          </Link>

          <Link
            href="/my-plan?tab=saved"
            className="navbar-counter-badge navbar-counter-badge-saved"
            aria-label={`${savedCount} saved workouts`}
          >
            <span className="text-muted-foreground text-xs sm:text-sm">Saved</span>
            <span className="badge-count-pill-saved">{savedCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
