export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  icon: 'movement' | 'hygiene' | 'meal';
  completed: boolean;
  progress?: { current: number; target: number; unit: string };
}

export const DAILY_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Mouvement',
    subtitle: '4 230 / 6 000 pas aujourd\'hui',
    icon: 'movement',
    completed: false,
    progress: { current: 4230, target: 6000, unit: 'pas' },
  },
  {
    id: '2',
    title: 'Hygiène',
    subtitle: 'Routine de soin commencée',
    icon: 'hygiene',
    completed: true,
  },
  {
    id: '3',
    title: 'Repas Conscients',
    subtitle: 'Nourrit votre onde intérieure',
    icon: 'meal',
    completed: true,
  },
];
