import { createContext, useContext } from 'react';

export type SpeechService = {
  speak: (
    text: string,
    language: string,
    callbacks: { onDone: () => void; onError: () => void },
  ) => Promise<void>;
  stop: () => Promise<void>;
};
export const SpeechContext = createContext<SpeechService | null>(null);
export function useSpeechService() {
  return useContext(SpeechContext);
}
