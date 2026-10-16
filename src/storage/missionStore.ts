import AsyncStorage from '@react-native-async-storage/async-storage';

// Data never leaves the device: AsyncStorage maps to localStorage on web.
const STORAGE_KEY = 'ondulo:missions:v1';

/** Completion state per mission id. */
export type CompletionMap = Record<string, boolean>;

export async function loadCompletion(): Promise<CompletionMap | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CompletionMap) : null;
  } catch {
    // Storage unavailable (private browsing, blocked cookies…): start fresh.
    return null;
  }
}

export async function saveCompletion(completion: CompletionMap): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completion));
  } catch {
    // Persisting is best effort; the in-memory state stays correct.
  }
}
