# 💪 FitLog — Workout Library & Training Companion

> **"Train with intent. Log every set."**  
> FitLog is a modern, responsive, high-performance web application built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. It empowers athletes to explore 12 major lifts, inspect detailed exercise biomechanics, assemble today's training plan with an unfinished cap, bookmark lifts for later, and track daily progress with local persistence.

---

## ⚡ Overview & Key Features

1. **🏋️‍♂️ The Workout Library (Home Page)**
   - Dynamic 3-column responsive grid on desktop, 2-column on tablet, and 1-column on mobile.
   - 12 comprehensive lifts fetched from the live FitLog REST API.
   - Rich card UI with visual thumbnail, category tags (`CHEST`, `ARMS`, `LEGS`, etc.), equipment line, and quick stats (Duration, Calories Burned, and Rating).
   - Hero banner with smooth in-page CTA scrolling to `#library`.

2. **🔍 Two-Column Interactive Details View (`/workouts/[id]`)**
   - Media showcase column with portrait artwork and accessible fallback.
   - Comprehensive key specifications table: Equipment, Difficulty, Sets, Reps, Duration, Calories, and Rating.
   - Step-by-step ordered instructions list.
   - Primary **"Add to today's plan"** and secondary **"Save for later"** actions with live counter badges, disabled states, and rich toast notifications (`Sonner`).

3. **📋 Today's Plan with 5 Unfinished Lifts Cap**
   - **5 Unfinished Lifts Cap**: Prevents overtraining by enforcing a strict 5-unfinished lift limit.
   - **"Mark as Done"**: Completed workouts remain in the daily log with a disabled status and checkmark, freeing up capacity for additional lifts.
   - **Live Metrics Panel**: Automatically calculates and updates planned `Exercises`, `Minutes`, and `Calories` in real-time.
   - Independent removal actions with immediate metrics recalculation.

4. **🔖 Independent Saved Workouts List**
   - Workouts can be saved for later independently from Today's Plan.
   - Distinct views for planned vs. saved workouts without data collision.
   - Active view reflects on the navbar counter badges (Filled lime badge for Plan, Outline badge for Saved).

5. **🔀 URL-Synchronized Tabs & Flexible Sorting**
   - Interactive tabs (`Today's Plan` / `Saved`) synchronized with URL query parameter (`?tab=saved` / `?tab=plan`) ensuring tab state persists across reloads.
   - Instant sorting dropdown supporting **Duration** (ascending), **Calories** (descending), and **Rating** (descending).
   - Clean dashed-border empty state with quick link back to workouts when no lifts are present.

6. **🎨 Unified Design Token System & Permanent Dark Theme**
   - `app/globals.css` serves as the single source of truth for design tokens.
   - Zero hardcoded design values or inline hex codes in JSX.
   - Typographic hierarchy using Google **Oswald** for bold display headings and **Inter** for crisp body text.
   - Reliable `localStorage` persistence with hydration protection and zero SSR mismatch.
   - Themed 404 page and resilient error boundaries with retry actions.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Full-stack React framework with Turbopack, dynamic routing, and server components |
| **React 19** | Component rendering, concurrent mode, and hooks (`useSyncExternalStore`) |
| **TypeScript 5** | Strict type safety across models, API responses, and application state |
| **Tailwind CSS v4 & PostCSS** | Modern utility-first styling with `@theme inline` and custom semantic tokens |
| **Radix UI & Shadcn UI** | Accessible foundation primitives (Tabs, Select, Card, Badge, Table, Separator) |
| **Lucide React** | Clean, accessible iconography |
| **Sonner** | Non-blocking dark-themed toast notifications |
| **pnpm** | Fast, disk space efficient package management |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/smatikuzzamanatik/Assignment-06.git
cd fitness-app
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Run development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run tests and typecheck
```bash
pnpm test       # Run plan-state unit tests with node:test
pnpm typecheck  # TypeScript validation
pnpm lint       # ESLint 9 validation
pnpm build      # Next.js production build
```