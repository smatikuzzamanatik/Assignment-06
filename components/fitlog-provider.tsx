"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  createEmptyPlanState,
  PLAN_STORAGE_KEY,
  restorePlanState,
  serializePlanState,
  updatePlanState,
  type PlanAction,
  type PlanOutcome,
  type PlanState,
} from "@/lib/plan-state";
import type { Workout } from "@/lib/workout";

interface FitLogSnapshot extends PlanState {
  ready: boolean;
}

interface FitLogContextValue extends FitLogSnapshot {
  addToPlan: (workout: Workout) => void;
  saveWorkout: (workout: Workout) => void;
  markDone: (id: number) => void;
  removeFromPlan: (id: number) => void;
  removeSaved: (id: number) => void;
}

const FitLogContext = createContext<FitLogContextValue | null>(null);

const messages: Partial<Record<PlanOutcome, string>> = {
  added: "Added to today's plan",
  saved: "Workout saved for later",
  completed: "Workout marked as done. Great work!",
  "removed-plan": "Workout removed from today's plan",
  "removed-saved": "Workout removed from saved",
  "duplicate-plan": "This workout is already in today's plan",
  "duplicate-saved": "This workout is already saved",
  "at-capacity": "Your plan has five unfinished lifts. Finish or remove one to add more.",
};

function createFitLogStore() {
  const initialSnapshot: FitLogSnapshot = { ...createEmptyPlanState(), ready: false };
  let snapshot = initialSnapshot;
  let storageWarningShown = false;
  const listeners = new Set<() => void>();

  function emitChange() {
    listeners.forEach((listener) => listener());
  }

  function dispatch(action: PlanAction) {
    // Action controls stay disabled until the saved snapshot has been restored.
    if (!snapshot.ready) return;
    const result = updatePlanState(snapshot, action);
    if (result.state !== snapshot) {
      snapshot = { ...result.state, ready: true };
      emitChange();
      try {
        window.localStorage.setItem(PLAN_STORAGE_KEY, serializePlanState(snapshot));
      } catch {
        if (!storageWarningShown) {
          toast.warning("Browser storage is unavailable. Changes will last for this session.");
          storageWarningShown = true;
        }
      }
    }

    const message = messages[result.outcome];
    if (!message) return;
    if (result.outcome === "at-capacity") toast.warning(message);
    else if (result.outcome.startsWith("duplicate")) toast.info(message);
    else toast.success(message);
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initialSnapshot,
    initialize() {
      if (snapshot.ready) return;
      let state = createEmptyPlanState();
      try {
        state = restorePlanState(window.localStorage.getItem(PLAN_STORAGE_KEY));
      } catch {
        // Restricted browser storage still allows a functional in-memory plan.
      }
      snapshot = { ...state, ready: true };
      emitChange();
    },
    actions: {
      addToPlan: (workout: Workout) => dispatch({ type: "add", workout }),
      saveWorkout: (workout: Workout) => dispatch({ type: "save", workout }),
      markDone: (id: number) => dispatch({ type: "done", id }),
      removeFromPlan: (id: number) => dispatch({ type: "remove-plan", id }),
      removeSaved: (id: number) => dispatch({ type: "remove-saved", id }),
    },
  };
}

export function FitLogProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createFitLogStore);
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useEffect(() => { store.initialize(); }, [store]);

  const value = useMemo(() => ({ ...snapshot, ...store.actions }), [snapshot, store]);

  return <FitLogContext.Provider value={value}>{children}</FitLogContext.Provider>;
}

export function useFitLog() {
  const context = useContext(FitLogContext);
  if (!context) throw new Error("useFitLog must be used within FitLogProvider");
  return context;
}
