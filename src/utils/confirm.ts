import { Alert, Platform } from 'react-native';

/** Cross-platform confirmation dialog (Alert.alert is a no-op on web). */
export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    { text: confirmLabel, onPress: onConfirm },
  ]);
}
