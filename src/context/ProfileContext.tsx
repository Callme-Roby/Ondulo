import { createContext, useContext } from 'react';
import { Profile } from '../storage/profileStore';

interface ProfileContextValue {
  profile: Profile;
  /** Forgets the profile and shows the onboarding again. */
  restartOnboarding: () => void;
}

export const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile(): ProfileContextValue {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileContext');
  return value;
}
