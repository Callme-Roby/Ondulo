import { TextStyle } from 'react-native';

// Palette from the Figma file (named styles first, then the neutrals used across screens)
export const Colors = {
  blue: '#135A9D', // "Bleu"
  blueText: '#165DA0',
  blueMuted: 'rgba(22, 93, 160, 0.5)',
  lightBlue: '#DDEAFA', // "Light blue"
  dayPill: '#CEE4F0',
  azure: '#A7F3EC', // "light azur"
  lightViolet: '#DDC8FF', // "Light violet"
  violet: '#65518A', // "Violet"
  green: '#0D6661', // "green"
  sky: '#7EB6FF',
  lightWhite: '#F5F7F9', // "Light White"
  middleWhite: '#E4EAEF', // "Middle White"
  white: '#FFFFFF',
  black: '#000000',
  ink: '#2A2F32',
  inkMuted: '#575C60',
  border: '#A9AEB1',
  progressTrack: '#D8E2EE',
  glass: 'rgba(255, 255, 255, 0.6)',
  iconBubble: 'rgba(126, 182, 255, 0.2)',
  cguCard: '#E6F0F5',
  chatFade: '#EEEDF7',

  // Billy's gradient
  blobGreen: '#D5FFB3',
  blobCyan: '#94F6FF',
  blobPink: '#FF9EF2',
};

// Font family names registered by @expo-google-fonts (see App.tsx)
export const Fonts = {
  jakartaSemiBold: 'PlusJakartaSans_600SemiBold',
  jakartaBold: 'PlusJakartaSans_700Bold',
  jakartaExtraBold: 'PlusJakartaSans_800ExtraBold',
  interRegular: 'Inter_400Regular',
  interItalic: 'Inter_400Regular_Italic',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
};

// Text styles shared by several screens
export const Type: Record<string, TextStyle> = {
  title: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Fonts.interRegular,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.inkMuted,
  },
  sectionLabel: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue,
  },
  cardTitle: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.ink,
  },
  cardText: {
    fontFamily: Fonts.interRegular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.inkMuted,
  },
  smallBold: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: Colors.blue,
  },
  chat: {
    fontFamily: Fonts.interMedium,
    fontSize: 16,
    lineHeight: 19.2,
    letterSpacing: 0.25,
    color: Colors.black,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 2,
  },
  badge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

// Content width of every Figma screen (390 frame - 2 × 24 gutter)
export const CONTENT_MAX_WIDTH = 448;
export const SCREEN_GUTTER = 24;
