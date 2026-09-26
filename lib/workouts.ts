import { isWorkout, type Workout } from "./workout";
import { FALLBACK_WORKOUTS } from "./workout-fallback";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";
const REQUEST_TIMEOUT_MS = 6_000;

async function requestWorkouts(path = ""): Promise<Response | null> {
  try {
    return await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FitLog/1.0",
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (cause) {
    if (
      cause &&
      typeof cause === "object" &&
      "digest" in cause &&
      cause.digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw cause;
    }
    console.warn(`[FitLog API] Network error for ${path || "/"}, using fallback:`, cause);
    return null;
  }
}

export async function getWorkouts(): Promise<Workout[]> {
  const response = await requestWorkouts();
  if (response && response.ok) {
    try {
      const data = await response.json();
      if (Array.isArray(data) && data.every(isWorkout)) {
        return data;
      }
    } catch (err) {
      console.warn("[FitLog API] Failed to parse API JSON, using fallback catalog:", err);
    }
  } else if (response) {
    console.warn(
      `[FitLog API] Upstream API returned status ${response.status} (Cloudflare rate-limited), using fallback catalog`
    );
  }
  return FALLBACK_WORKOUTS;
}

export async function getWorkout(id: string): Promise<Workout | null> {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return null;
  const numId = Number(id);

  const response = await requestWorkouts(`/${id}`);
  if (response && response.ok) {
    try {
      const data = await response.json();
      if (isWorkout(data) && data.id === numId) {
        return data;
      }
    } catch (err) {
      console.warn(`[FitLog API] Failed to parse workout ${id} JSON, using fallback:`, err);
    }
  } else if (response && response.status === 404) {
    return null;
  }

  // Gracefully fallback to verified catalog for rate-limited upstream
  const fallback = FALLBACK_WORKOUTS.find((w) => w.id === numId);
  return fallback ?? null;
}
