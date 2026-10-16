import type { Profile } from '../state/AppState';

export type TextField = 'petName' | 'userName' | 'birthday' | 'dailyLife';

export type Reply =
  /** Two quick answers side by side */
  | { kind: 'choices'; options: string[] }
  /** Free text in the message bar */
  | { kind: 'text'; field: TextField }
  /** 2 × 2 grid of answers */
  | { kind: 'allergies'; options: { label: string; answer: string }[] }
  | { kind: 'colors'; options: { label: string; tint: string; bubble: string }[] }
  /** Single call to action */
  | { kind: 'button'; label: string; finish?: boolean };

export interface ChatStep {
  billy: (profile: Partial<Profile>) => string[];
  reply: Reply;
}

// Conversation from the Figma file ("Prise d'information" frames)
export const CHAT_STEPS: ChatStep[] = [
  {
    billy: () => [
      "Salut ! 👋 Comment ça va ? Je viens tout juste d'arriver ici et je suis un peu désorienté...",
    ],
    reply: { kind: 'choices', options: ['Salut ! Ça va, mais tu es qui ?', 'Coucou ! Ça va super.'] },
  },
  {
    billy: () => [
      "Je suis ton nouveau petit protégé ! Mais j'ai un petit problème... je n'ai pas encore de prénom. Tu voudrais bien m'en donner un ? 🥺",
    ],
    reply: { kind: 'text', field: 'petName' },
  },
  {
    billy: ({ petName }) => [`${petName}... J'adore ! Merci ! ✨ Et toi, comment tu t'appelles ?`],
    reply: { kind: 'text', field: 'userName' },
  },
  {
    billy: ({ userName }) => [
      `Enchanté ${userName} ! Pour qu'on puisse fêter nos anniversaires ensemble, c'est quand le tien ? 🎂`,
    ],
    reply: { kind: 'text', field: 'birthday' },
  },
  {
    billy: () => [
      "C'est noté dans mon petit calendrier ! 🗓️\nIl faut que je t'explique un secret sur moi : je ne grandis que si TU prends soin de TOI. Si tu fais ton lit, que tu te cuisines un bon petit plat ou que tu sors te balader, ça me donne plein d'énergie ! 💪",
    ],
    reply: { kind: 'choices', options: ["C'est un bon marché !", "Ça a l'air sympa !"] },
  },
  {
    billy: () => [
      "Grave ! D'ailleurs, pour que je te propose des missions qui collent à ton rythme (et ne pas te demander d'aller marcher 3km en pleine réunion 😅), c'est quoi ton quotidien en ce moment ?",
    ],
    reply: { kind: 'text', field: 'dailyLife' },
  },
  {
    billy: () => [
      "Parfait, je m'adapterai !\nJ'ai aussi prévu de te lancer des défis de cuisine de temps en temps 🧑‍🍳. Mais attention, je suis super allergique à un truc... Tu me choisis mon allergie pour que je ne te propose pas de bêtises ?",
    ],
    reply: {
      kind: 'allergies',
      options: [
        { label: 'Gluten', answer: 'Le gluten !' },
        { label: 'Produits laitiers', answer: 'Les produits laitiers !' },
        { label: 'Autres allergies', answer: "Une autre allergie !" },
        { label: 'Pas d’allergies', answer: "Je n'ai pas d'allergies !" },
      ],
    },
  },
  {
    billy: () => [
      "Ouf, merci de me prévenir, je raye ça de mon carnet de recettes ! 🚫\nBon, je me sens déjà beaucoup mieux avec toi.",
      'Dernière question, quelle est ta couleur phare parmi ces 4-là ?',
    ],
    reply: {
      kind: 'colors',
      options: [
        { label: 'Rouge', tint: 'rgba(255, 0, 0, 0.2)', bubble: '#F7C6C7' },
        { label: 'Vert', tint: 'rgba(21, 255, 0, 0.2)', bubble: '#C8F9C7' },
        { label: 'Bleu', tint: 'rgba(0, 229, 255, 0.2)', bubble: '#C4F3FA' },
        { label: 'Jaune', tint: 'rgba(246, 255, 0, 0.2)', bubble: '#F5F9C7' },
      ],
    },
  },
  {
    billy: () => [
      "C'est vraiment une chouette couleur, ça ! Tu dois être quelqu'un de lumineux !\nPrêt(e) pour notre toute première mission commune ?",
    ],
    reply: { kind: 'button', label: 'Je suis prêt(e) !' },
  },
  {
    billy: () => [
      "Super ! Ta première mission est toute simple : Va boire un grand verre d'eau. 💧\nClique sur le bouton en bas quand c'est fait, ça me donnera ma première dose d'énergie pour aujourd'hui ! À tout de suite !",
    ],
    reply: { kind: 'button', label: 'Commencer', finish: true },
  },
];

/** "Billy !" → "Billy" */
export function cleanName(text: string): string {
  return text.trim().replace(/[\s!.?…]+$/u, '').slice(0, 24);
}

/** Formats digits as JJ/MM/AAAA while typing. */
export function formatBirthday(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}

export function isValidBirthday(text: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return false;
  const [day, month, year] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    year >= 1900 &&
    date.getTime() <= Date.now()
  );
}
