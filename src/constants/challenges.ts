export interface Recipe {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  reward: number;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
}

export interface Walk {
  id: string;
  title: string;
  duration: string;
  distance: string;
  reward: number;
  start: string;
  end: string;
}

export const RECIPE: Recipe = {
  id: 'bol-grains-dores',
  title: 'Bol apaisant aux grains dorés',
  duration: '12 min',
  difficulty: 'Facile',
  reward: 35,
  ingredients: [
    { name: 'quinoa', quantity: '150 g' },
    { name: 'avocat', quantity: '150 g' },
    { name: 'graines de courge', quantity: '2 c.s.' },
    { name: 'huile d’olive', quantity: '1 trait' },
    { name: 'en zeste', quantity: '1 citron' },
  ],
  steps: [
    'Rince le quinoa à l’eau froide en cercles lents.',
    'Fais-le cuire 10 min dans une eau à peine salée.',
    'Pendant ce temps, coupe l’avocat en lamelles douces.',
    'Dresse, parsème de graines, de zeste, d’une onde d’huile.',
  ],
};

export const WALK: Walk = {
  id: 'parcours-marche',
  title: 'Parcours de marche',
  duration: '1h 30',
  distance: '4,5  km',
  reward: 50,
  start: 'Votre position',
  end: 'Stalingrad',
};

/** A new walk unlocks this long after the previous one is done. */
export const WALK_COOLDOWN_MS = 24 * 60 * 60 * 1000;
