import { useCallback } from 'react';
import { useAppState } from '../state/AppState';
import { confirmAction } from '../utils/confirm';

/** Settings button: start the adventure again (clears the data stored on this device). */
export function useSettings() {
  const { resetAll, petName } = useAppState();
  return useCallback(
    () =>
      confirmAction(
        'Recommencer l’aventure ?',
        `Toutes les données enregistrées sur cet appareil seront effacées et ${petName} te reposera ses questions.`,
        'Recommencer',
        resetAll
      ),
    [resetAll, petName]
  );
}
