import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** Refresh time-based UI while active and immediately after returning to the app. */
export function useCurrentTime(intervalMs = 30_000) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = setInterval(() => {
      if (AppState.currentState === 'active') refresh();
    }, intervalMs);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [intervalMs]);
  return now;
}
