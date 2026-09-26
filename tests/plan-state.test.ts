import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyPlanState,
  getPlanTotals,
  restorePlanState,
  serializePlanState,
  sortPlanEntries,
  sortWorkouts,
  updatePlanState,
  type PlanState,
} from "../lib/plan-state.ts";
import type { Workout } from "../lib/workout.ts";

function workout(id: number, overrides: Partial<Workout> = {}): Workout {
  return {
    id,
    name: `Workout ${id}`,
    image: "https://img.magnific.com/free-photo/workout.jpg",
    muscleGroups: ["Arms"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    duration: 10,
    caloriesBurned: 80,
    sets: 3,
    reps: "10-12",
    rating: 4.3,
    description: "A workout description.",
    instructions: ["Stand tall.", "Move with control."],
    ...overrides,
  };
}

function add(state: PlanState, id: number): PlanState {
  return updatePlanState(state, { type: "add", workout: workout(id) }).state;
}

test("starts empty and permits a workout independently in both lists", () => {
  const empty = createEmptyPlanState();
  assert.deepEqual(getPlanTotals(empty.plan), { exercises: 0, minutes: 0, calories: 0 });
  let state = add(empty, 1);
  state = updatePlanState(state, { type: "save", workout: workout(1) }).state;
  assert.equal(state.plan.length, 1);
  assert.equal(state.saved.length, 1);
  assert.deepEqual(empty, { plan: [], saved: [] });
});

test("repeated add/save actions prevent duplicates without changing state", () => {
  let state = add(createEmptyPlanState(), 1);
  state = updatePlanState(state, { type: "save", workout: workout(1) }).state;
  const repeatedPlan = updatePlanState(state, { type: "add", workout: workout(1) });
  const repeatedSaved = updatePlanState(state, { type: "save", workout: workout(1) });
  assert.equal(repeatedPlan.outcome, "duplicate-plan");
  assert.equal(repeatedSaved.outcome, "duplicate-saved");
  assert.equal(repeatedPlan.state, state);
  assert.equal(repeatedSaved.state, state);
});

test("five unfinished lifts block a sixth; completing one frees a slot and retains history", () => {
  let state = createEmptyPlanState();
  for (let id = 1; id <= 5; id += 1) state = add(state, id);
  const blocked = updatePlanState(state, { type: "add", workout: workout(6) });
  assert.equal(blocked.outcome, "at-capacity");
  assert.equal(blocked.state, state);

  state = updatePlanState(state, { type: "done", id: 1 }).state;
  assert.equal(state.plan.length, 5);
  assert.equal(state.plan[0].done, true);
  state = add(state, 6);
  assert.equal(state.plan.length, 6);
  assert.equal(state.plan.filter(({ done }) => !done).length, 5);
  assert.equal(updatePlanState(state, { type: "done", id: 1 }).outcome, "unchanged");
  assert.equal(updatePlanState(state, { type: "add", workout: workout(1) }).outcome, "duplicate-plan");
});

test("summary includes completed planned lifts and excludes saved-only lifts", () => {
  let state = createEmptyPlanState();
  state = updatePlanState(state, { type: "add", workout: workout(1, { duration: 8, caloriesBurned: 70 }) }).state;
  state = updatePlanState(state, { type: "add", workout: workout(2, { duration: 15, caloriesBurned: 120 }) }).state;
  state = updatePlanState(state, { type: "save", workout: workout(3) }).state;
  state = updatePlanState(state, { type: "done", id: 1 }).state;
  assert.deepEqual(getPlanTotals(state.plan), { exercises: 2, minutes: 23, calories: 190 });
});

test("removing from one list preserves the other and updates the summary", () => {
  let state = add(createEmptyPlanState(), 1);
  state = updatePlanState(state, { type: "save", workout: workout(1) }).state;
  const withoutPlan = updatePlanState(state, { type: "remove-plan", id: 1 }).state;
  assert.equal(withoutPlan.saved.length, 1);
  assert.deepEqual(getPlanTotals(withoutPlan.plan), { exercises: 0, minutes: 0, calories: 0 });
  const withoutSaved = updatePlanState(state, { type: "remove-saved", id: 1 }).state;
  assert.equal(withoutSaved.plan.length, 1);
  assert.equal(withoutSaved.saved.length, 0);
  assert.equal(updatePlanState(state, { type: "remove-plan", id: 999 }).state, state);
});

test("round-trip persistence preserves independent lists and done status", () => {
  let state = add(createEmptyPlanState(), 1);
  state = updatePlanState(state, { type: "done", id: 1 }).state;
  state = updatePlanState(state, { type: "save", workout: workout(1) }).state;
  assert.deepEqual(restorePlanState(serializePlanState(state)), state);
});

test("invalid or obsolete storage recovers to empty state", () => {
  for (const serialized of [null, "", "not json", "null", "[]", '{"version":2}', '{"version":1,"plan":{}}']) {
    assert.deepEqual(restorePlanState(serialized), createEmptyPlanState());
  }
});

test("restoration filters malformed and duplicate items while enforcing the unfinished cap", () => {
  const entries = Array.from({ length: 7 }, (_, index) => ({ workout: workout(index + 1), done: false }));
  const serialized = JSON.stringify({
    version: 1,
    plan: [
      { workout: workout(20), done: true },
      ...entries,
      entries[0],
      { workout: workout(21), done: "false" },
      { workout: { id: 22 }, done: false },
    ],
    saved: [workout(1), workout(1), { id: 22 }, workout(2)],
  });
  const state = restorePlanState(serialized);
  assert.deepEqual(state.plan.map(({ workout }) => workout.id), [20, 1, 2, 3, 4, 5]);
  assert.deepEqual(state.saved.map(({ id }) => id), [1, 2]);
});

test("sorts duration ascending and calories/rating descending without mutating source", () => {
  const items = [
    workout(1, { duration: 25, caloriesBurned: 100, rating: 4.2 }),
    workout(2, { duration: 8, caloriesBurned: 200, rating: 4.9 }),
    workout(3, { duration: 15, caloriesBurned: 300, rating: 4.5 }),
  ];
  assert.deepEqual(sortWorkouts(items, "duration").map(({ id }) => id), [2, 3, 1]);
  assert.deepEqual(sortWorkouts(items, "calories").map(({ id }) => id), [3, 2, 1]);
  assert.deepEqual(sortWorkouts(items, "rating").map(({ id }) => id), [2, 3, 1]);
  assert.deepEqual(items.map(({ id }) => id), [1, 2, 3]);
  const entries = items.map((item) => ({ workout: item, done: item.id === 1 }));
  assert.deepEqual(sortPlanEntries(entries, "duration").map(({ workout }) => workout.id), [2, 3, 1]);
  assert.equal(sortPlanEntries(entries, "duration")[2].done, true);
});
