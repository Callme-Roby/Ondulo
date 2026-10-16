export type MissionIcon = 'mobility' | 'hygiene' | 'meal';

export interface MissionTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: MissionIcon;
  /** The mission asks for a photo as proof (first mission of the onboarding). */
  photo?: boolean;
}

/** XP and stars earned per completed daily mission. */
export const MISSION_REWARD = 20;

// Day 1: the single mission Billy gives at the end of the onboarding
const FIRST_DAY: MissionTemplate[] = [
  {
    id: 'water',
    title: 'Boire de l’eau',
    subtitle: 'Avec cette eau je serais en meilleur forme',
    icon: 'meal',
    photo: true,
  },
];

const EVERY_DAY: MissionTemplate[] = [
  { id: 'movement', title: 'Mouvement', subtitle: 'Objectif : 6 000 pas aujourd’hui', icon: 'mobility' },
  { id: 'hygiene', title: 'Hygiène', subtitle: 'Routine de soin commencée', icon: 'hygiene' },
  { id: 'meal', title: 'Repas Conscients', subtitle: 'Nourrit votre onde intérieure', icon: 'meal' },
];

export function missionsForDay(day: number): MissionTemplate[] {
  return day <= 1 ? FIRST_DAY : EVERY_DAY;
}

export function findMission(id: string): MissionTemplate | undefined {
  return [...FIRST_DAY, ...EVERY_DAY].find((m) => m.id === id);
}
