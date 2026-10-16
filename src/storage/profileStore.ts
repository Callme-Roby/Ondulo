import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingAnswers } from '../constants/onboarding';

// Stays on the device, like mission progress (localStorage on web).
const STORAGE_KEY = 'ondulo:profile:v1';

export interface Profile extends Partial<OnboardingAnswers> {
  /** ISO date of the end of onboarding. */
  createdAt: string;
}

export async function loadProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Best effort: the session keeps working, onboarding shows again next launch.
  }
}

export async function clearProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
}
