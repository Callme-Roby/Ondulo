import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MISSION_REWARD, MissionTemplate, findMission, missionsForDay } from '../constants/missions';
import { SHOP_ITEMS } from '../constants/shop';
import { RECIPE, WALK, WALK_COOLDOWN_MS } from '../constants/challenges';

// Everything stays on the device: AsyncStorage maps to localStorage on web.
const STORAGE_KEY = 'ondulo:state:v2';

/** XP to reach for each of Billy's evolutions. */
const EVOLUTIONS = [50, 150, 300, 500, 800, 1200, 1700];

export interface Profile {
  petName: string;
  userName: string;
  birthday: string;
  dailyLife: string;
  allergy: string;
  color: string;
}

export interface HistoryEntry {
  missionId: string;
  date: string;
}

interface AppData {
  /** null until the onboarding conversation is finished */
  profile: Profile | null;
  /** Local date (YYYY-MM-DD) of day 1 */
  startDate: string | null;
  cguAccepted: boolean;
  xp: number;
  stars: number;
  /** Completed mission ids per local date */
  completed: Record<string, string[]>;
  history: HistoryEntry[];
  inventory: string[];
  recipesDone: string[];
  walkDoneAt: number | null;
}

const EMPTY: AppData = {
  profile: null,
  startDate: null,
  cguAccepted: false,
  xp: 0,
  stars: 0,
  completed: {},
  history: [],
  inventory: [],
  recipesDone: [],
  walkDoneAt: null,
};

export interface DailyMission extends MissionTemplate {
  completed: boolean;
}

export interface HistoryItem extends MissionTemplate {
  key: string;
}

interface AppStateValue {
  hydrated: boolean;
  profile: Profile | null;
  petName: string;
  cguAccepted: boolean;
  day: number;
  xp: number;
  nextEvolution: number;
  stars: number;
  missions: DailyMission[];
  history: HistoryItem[];
  inventory: string[];
  recipesDone: string[];
  /** Milliseconds before a new walk is available, 0 when one is available */
  walkCooldown: number;
  completeOnboarding: (profile: Profile) => void;
  acceptCgu: () => void;
  completeMission: (id: string) => void;
  buyItem: (id: string) => boolean;
  completeRecipe: (id: string) => void;
  completeWalk: () => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function localDate(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData({ ...EMPTY, ...(JSON.parse(raw) as Partial<AppData>) });
      })
      .catch(() => {
        // Storage unavailable (private browsing, blocked cookies…): start fresh.
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {
      // Best effort: the in-memory state stays correct for this session.
    });
  }, [data, hydrated]);

  const reward = (d: AppData, amount: number): AppData => ({
    ...d,
    xp: d.xp + amount,
    stars: d.stars + amount,
  });

  const completeOnboarding = useCallback((profile: Profile) => {
    setData((d) => ({ ...d, profile, startDate: localDate() }));
  }, []);

  const acceptCgu = useCallback(() => setData((d) => ({ ...d, cguAccepted: true })), []);

  const completeMission = useCallback((id: string) => {
    setData((d) => {
      const today = localDate();
      const done = d.completed[today] ?? [];
      if (done.includes(id)) return d;
      return reward(
        {
          ...d,
          completed: { ...d.completed, [today]: [...done, id] },
          history: [{ missionId: id, date: today }, ...d.history],
        },
        MISSION_REWARD
      );
    });
  }, []);

  const buyItem = useCallback(
    (id: string) => {
      const item = SHOP_ITEMS.find((i) => i.id === id);
      if (!item || data.inventory.includes(id) || data.stars < item.price) return false;
      setData((d) => ({ ...d, stars: d.stars - item.price, inventory: [...d.inventory, id] }));
      return true;
    },
    [data.inventory, data.stars]
  );

  const completeRecipe = useCallback((id: string) => {
    setData((d) =>
      d.recipesDone.includes(id)
        ? d
        : reward({ ...d, recipesDone: [...d.recipesDone, id] }, RECIPE.reward)
    );
  }, []);

  const completeWalk = useCallback(() => {
    setData((d) => reward({ ...d, walkDoneAt: Date.now() }, WALK.reward));
  }, []);

  const resetAll = useCallback(() => setData(EMPTY), []);

  const value = useMemo<AppStateValue>(() => {
    const today = localDate();
    const day = data.startDate ? daysBetween(data.startDate, today) + 1 : 1;
    const doneToday = data.completed[today] ?? [];
    const history = data.history.flatMap((entry, index) => {
      const mission = findMission(entry.missionId);
      return mission ? [{ ...mission, key: `${entry.date}-${entry.missionId}-${index}` }] : [];
    });
    const walkCooldown = data.walkDoneAt
      ? Math.max(0, data.walkDoneAt + WALK_COOLDOWN_MS - Date.now())
      : 0;

    return {
      hydrated,
      profile: data.profile,
      petName: data.profile?.petName || 'Billy',
      cguAccepted: data.cguAccepted,
      day,
      xp: data.xp,
      nextEvolution: EVOLUTIONS.find((step) => step > data.xp) ?? EVOLUTIONS[EVOLUTIONS.length - 1],
      stars: data.stars,
      missions: missionsForDay(day).map((m) => ({ ...m, completed: doneToday.includes(m.id) })),
      history,
      inventory: data.inventory,
      recipesDone: data.recipesDone,
      walkCooldown,
      completeOnboarding,
      acceptCgu,
      completeMission,
      buyItem,
      completeRecipe,
      completeWalk,
      resetAll,
    };
  }, [data, hydrated, completeOnboarding, acceptCgu, completeMission, buyItem, completeRecipe, completeWalk, resetAll]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
