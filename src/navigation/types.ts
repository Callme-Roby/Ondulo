import type { NavigatorScreenParams } from '@react-navigation/native';

export type DefisStackParamList = {
  DefisList: undefined;
  Recette: { recipeId: string };
  Parcours: undefined;
};

export type TabParamList = {
  Accueil: undefined;
  'Mini Moi': undefined;
  Boutique: undefined;
  Défis: NavigatorScreenParams<DefisStackParamList>;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Photo: { missionId: string };
};
