"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Match, type DrillLog } from "@/lib/db";

// ---------------------------------------------------------------------------
// useMatches — all matches sorted by date descending
// ---------------------------------------------------------------------------
export function useMatches(): { matches: Match[]; loading: boolean } {
  const result = useLiveQuery(
    () => db.matches.orderBy("date").reverse().toArray(),
    []
  );
  return {
    matches: result ?? [],
    loading: result === undefined,
  };
}

// ---------------------------------------------------------------------------
// useRecentMatches — last N matches by date
// ---------------------------------------------------------------------------
export function useRecentMatches(
  count: number
): { matches: Match[]; loading: boolean } {
  const result = useLiveQuery(
    () =>
      db.matches
        .orderBy("date")
        .reverse()
        .limit(count)
        .toArray(),
    [count]
  );
  return {
    matches: result ?? [],
    loading: result === undefined,
  };
}

// ---------------------------------------------------------------------------
// useAddMatch — returns an async function to persist a new match
// ---------------------------------------------------------------------------
export function useAddMatch(): (match: Omit<Match, "id">) => Promise<number> {
  return (match: Omit<Match, "id">) => db.matches.add(match);
}

// ---------------------------------------------------------------------------
// useDrillLogs — all drill logs sorted by date descending
// ---------------------------------------------------------------------------
export function useDrillLogs(): { logs: DrillLog[]; loading: boolean } {
  const result = useLiveQuery(
    () => db.drillLogs.orderBy("date").reverse().toArray(),
    []
  );
  return {
    logs: result ?? [],
    loading: result === undefined,
  };
}

// ---------------------------------------------------------------------------
// useAddDrillLog — returns an async function to persist a new drill log
// ---------------------------------------------------------------------------
export function useAddDrillLog(): (
  log: Omit<DrillLog, "id">
) => Promise<number> {
  return (log: Omit<DrillLog, "id">) => db.drillLogs.add(log);
}

// ---------------------------------------------------------------------------
// useSetting — read/write a single settings row by key
// ---------------------------------------------------------------------------
export function useSetting(key: string): {
  value: string | number | boolean | undefined;
  setValue: (val: string | number | boolean) => Promise<void>;
  loading: boolean;
} {
  const result = useLiveQuery(
    () => db.settings.get(key),
    [key]
  );

  // result === undefined  → query still resolving (loading)
  // result === null / missing row → resolved, but no value stored yet
  const loading = result === undefined;
  const value = result?.value;

  const setValue = async (val: string | number | boolean): Promise<void> => {
    await db.settings.put({ key, value: val });
  };

  return { value, setValue, loading };
}
