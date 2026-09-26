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
git clone <repository-url>
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

---

# 📋 Original Assignment Specifications

## 📅 Deadline For 60 marks: 26 September | ⏱️11:59PM
## 📅 Deadline For 50 marks: 27 September | ⏱️11:59PM
## 📅 Deadline for 30 marks: Any time after 27 September 2026

--- 
# API's 

Fitlog Api:
All data:
https://api.abcz.workers.dev/api/fitlog


Details/Single Data:
https://api.abcz.workers.dev/api/fitlog/:id

--- 

## 🐣 Basic Requirements (Must Do for Everyone)
- Your app must work on all screen sizes — mobile, tablet, and desktop
- Make at least 8 Git commits with clear, meaningful messages (e.g., "added to today's plan card component")
- Your app must run without any errors after deployment
- Add a nice README.md file with your project name, description, technologies used, and features(minimum 5)

--- 


# 🔧 Main Requirements — 50 Marks


### 1. 🔝 Navbar


- Design the Navbar exactly like the Figma design
- Put your logo on the left side
- Put your navigation links on the middle — links are: Workout, My Plan
- The active page link should look different (highlighted), just like the Figma design
- **Right-side status badges (counters)**: a "Plan" badge and a "Saved" badge, each showing a number.
  - Plan badge = filled pill with accent background (e.g. `#ccff00`).
  - Saved badge = pill with outline/border only.
--- 


### 2. 🅱️ Hero / Banner (Top of the Home page)
- Eyebrow text: **"WORKOUT LIBRARY"**.
- Main heading: **"TRAIN WITH INTENT. LOG EVERY SET."** (uppercase, bold display font, e.g. Oswald).
- Subtitle: *"FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up."*
- A primary **CTA button with an icon**: **"BROWSE WORKOUTS"**.
  - It scrolls the user down to the `#library` section on the same page (an anchor link, not a route change).
- A **banner/hero image** on the right side.


### 2.1 Navbar behavior (see also section 1)
- The "Plan" and "Saved" badge counters in the navbar both link to `/my-plan`.
- The badge numbers reflect the number of items currently in **Today's Plan** and **Saved**.( See Requirements Below)


--- 

### 3. ⚖️ The Library Section (Home Page)
- Heading: **"THE LIBRARY"** with subtitle **"Twelve lifts covering every major muscle group."**
- Display all workouts from the API's data as cards in a **3x4 grid on large screens** (like the design). Must be responsive.
- Each card must show:
  - 📷 Illustration/image
  - 🏷️ Category tag pills (e.g. `CHEST`, `ARMS`)
  - 📛 Workout name (e.g. "BARBELL BENCH PRESS")
  - 🖇️ Equipment line (e.g. "Barbell, Bench")
  - 🔴 Stats row with icons: duration (`25 min`), calories (`180 kcal`), rating (`4.8`)
- 🧭 Clicking a card navigates the user to that workout's **Detail Page**.

--- 

### 4. Workout Details Page — Layout (two-column, follow the design)
**Left Side — Visual/Media:**
- A large image/illustration of the workout fills the column.

**Right Side — sections:**
- Title: "BARBELL BENCH PRESS"
- Subtitle/description: *"A compound press that builds chest thickness, triceps, and pressing power from a stable bench."*
- Category tags: `Chest`, `Arms`
- **Key Specs table/panel** with label + value rows:
  - EQUIPMENT / DIFFICULTY / SETS / REPS / DURATION / CALORIES / RATING
  (e.g. Barbell, Bench / Intermediate / 4 / 6-8 / 25 min / 180 kcal / 4.8)
- **INSTRUCTIONS** section: ordered list of 4 steps (number + text)
- **Call-to-action buttons:**
  - Primary button: **"Add to today's plan"** (with icon)
  - Secondary button: **"Save for later"** (with icon)

### 5. Details Page — Button Functionality
- Clicking **"Add to today's plan"**:
  - Adds the workout to the **Today's Plan** tab on the My Plan page.
  - Increments the "Plan" badge counter in the navbar.
  - Shows a **toast notification** (e.g. "Added to today's plan").
- Clicking **"Save for later"**:
  - Adds the workout to the **Saved** tab on the My Plan page.
  - Increments the "Saved" badge counter in the navbar.
  - Shows a **toast notification**.
- On the **My Plan** page, each planned workout card has:
  - **"View Details"** button → opens the workout detail page.

### 6. My Plan Page (`/my-plan`) — the "log" page
Follow the live site + design exactly:
- Title: **"MY PLAN"**, subtitle: *"Cap of five lifts for today. Finish them, then load more."*
- **Metrics Summary row** (3 stat cards): `Exercises`, `Minutes`, `Calories` — start at 0 and update live as items are added/removed from the plan.
- **Tabs**: `Today's Plan` / `Saved` (active tab highlighted).
- **Loading state**: show "Loading workouts…" while fetching before the list renders.
- **Workout cards list**: each entry shows thumbnail, title (e.g. "RUSSIAN TWIST"), equipment (e.g. "Medicine Ball"), and a stats row with duration / calories / rating icons + action buttons (View Details / Mark as Done / X remove).
- **Empty state** (when the list is empty): "NOTHING HERE YET", text *"Browse the library and add a lift to get today moving."*, and a CTA button **"Go to workouts"** (links back to `/`).

### 7. Footer
- Match the Figma design: dark footer.
- **Left**: brand logo icon + **FITLOG**.
- **Right**: copyright line: *"© 2026 FitLog — Workout Library. Train hard, log honest."*

### 8. Responsive Design
- The entire website must work correctly on mobile, tablet, and desktop screen sizes (grid collapses correctly, navbar stays usable, hero stacks, etc.).

--- 

#	Requirement
- Add a 404 Page for any unknown/invalid route
- Show a loading animation while the exercise data is being fetched on the Home page
- Show a relevant toast notification when the detail's page button.
- Make sure reloading any page after deployment does not cause an error

--- 

# Challenge Requirements — 10 Marks


### C1. - **Sort dropdown**: 
"Sort By" → options `Duration`, `Calories`, `Rating` (default `Duration`, with chevron icon); it re-sorts the current list.

### C2. GitHub README
- Add a well-designed `README.md` that includes:
  - Project name
  - Short description
  - Technologies used
  - 5 key features of the project

### C3. - On the **My Plan** page, each planned workout card has:
  - **"Mark as Done"** button (with check icon) → marks the workout done, shows a toast.
  - **Remove (X)** button → removes the workout, shows a toast.

--- 

## Optional (No Marks — Highly Recommended)
- Persist the plan/saved data in `localStorage` so it survives a page reload.
- Search the My Plan / library entries by workout name or tag.
- Disable "Add to today's plan" when the plan already contains 5 lifts (the cap mentioned in the subtitle).
### 🛠️ Technologies to Use
Technology	Purpose
- Next.js	Build the UI
- App router(Next.js) +	Handle page navigation
- Tailwind CSS + Any component library	Styling and responsiveness

### 🚀 Deployment
Deploy your project on Vercel, Netlify, Cloudflare Pages, or anywhere else before submitting.

## 📬 Submission
Fill in both links before submitting:

- Live Link:
- GitHub Repository Link: https://github.com/smatikuzzamanatik/Assignment-06.git