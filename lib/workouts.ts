import { isWorkout, type Workout } from "./workout";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";
const REQUEST_TIMEOUT_MS = 12_000;

async function requestWorkouts(path = ""): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
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
    throw new Error(
      "The workout service could not be reached. Please try again.",
      { cause },
    );
  }
}

async function readResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(
      `The workout service returned an error (${response.status}). Please try again.`,
    );
  }

  try {
    return await response.json();
  } catch (cause) {
    throw new Error("The workout service returned unreadable data. Please try again.", {
      cause,
    });
  }
}

export async function getWorkouts(): Promise<Workout[]> {
  const data = await readResponse(await requestWorkouts());
  if (!Array.isArray(data) || !data.every(isWorkout)) {
    throw new Error("The workout library contains invalid data. Please try again.");
  }
  return data;
}

export async function getWorkout(id: string): Promise<Workout | null> {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return null;

  const response = await requestWorkouts(`/${id}`);
  if (response.status === 404) return null;

  const data = await readResponse(response);
  if (!isWorkout(data) || data.id !== Number(id)) {
    throw new Error("The workout details contain invalid data. Please try again.");
  }
  return data;
}
