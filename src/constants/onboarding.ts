export type Mood = 'bien' | 'variable' | 'bas' | 'secret';
export type Focus = 'bouger' | 'manger' | 'soin' | 'lien';

export interface OnboardingAnswers {
  name: string;
  mood: Mood;
  focus: Focus;
}

export type Reply =
  | { kind: 'text'; field: 'name'; placeholder: string }
  | { kind: 'choice'; field: 'mood'; options: { value: Mood; label: string }[] }
  | { kind: 'choice'; field: 'focus'; options: { value: Focus; label: string }[] }
  | { kind: 'finish'; label: string };

export interface OnboardingStep {
  /** What Billy says, given the answers collected so far. */
  billy: (answers: Partial<OnboardingAnswers>) => string[];
  reply: Reply;
}

const MOOD_REACTIONS: Record<Mood, string> = {
  bien: 'Super, on va garder cet élan ensemble.',
  variable: 'Je comprends. On avancera à ton rythme, sans pression.',
  bas: 'Merci de me le dire. On y va tout doucement, je reste à côté de toi.',
  secret: "Pas de souci, tu n'as rien à justifier ici.",
};

const FOCUS_REACTIONS: Record<Focus, string> = {
  bouger: 'Bonne idée. Même quelques pas, ça compte.',
  manger: "Bien manger, c'est nourrir ton onde intérieure.",
  soin: "Prendre soin de soi, c'est la base de tout le reste.",
  lien: "Tu n'es pas seul·e : je suis là, et on pensera aussi aux autres.",
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    billy: () => [
      "Coucou, moi c'est Billy !",
      "Je suis là pour t'aider à prendre soin de toi, un petit geste à la fois.",
      "Comment est-ce que je peux t'appeler ?",
    ],
    reply: { kind: 'text', field: 'name', placeholder: 'Ton prénom' },
  },
  {
    billy: ({ name }) => [`Enchanté, ${name} !`, 'Et en ce moment, comment tu te sens ?'],
    reply: {
      kind: 'choice',
      field: 'mood',
      options: [
        { value: 'bien', label: 'Plutôt bien' },
        { value: 'variable', label: 'Ça va, ça vient' },
        { value: 'bas', label: 'Un peu à plat' },
        { value: 'secret', label: 'Je préfère ne pas dire' },
      ],
    },
  },
  {
    billy: ({ mood }) => [
      mood ? MOOD_REACTIONS[mood] : '',
      "Qu'est-ce qui te ferait du bien en premier ?",
    ].filter(Boolean),
    reply: {
      kind: 'choice',
      field: 'focus',
      options: [
        { value: 'bouger', label: 'Bouger un peu plus' },
        { value: 'manger', label: 'Mieux manger' },
        { value: 'soin', label: 'Prendre soin de moi' },
        { value: 'lien', label: 'Me sentir moins seul·e' },
      ],
    },
  },
  {
    billy: ({ focus }) => [
      focus ? FOCUS_REACTIONS[focus] : '',
      'Chaque jour, je te proposerai quelques petites missions. Plus tu en fais, plus je grandis et je reprends des couleurs.',
      'Et tout ce que tu me confies reste sur cet appareil. Rien ne part sur Internet.',
    ].filter(Boolean),
    reply: { kind: 'finish', label: "C'est parti !" },
  },
];
