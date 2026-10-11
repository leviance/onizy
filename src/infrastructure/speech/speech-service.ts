import type { SpeechService } from '@/shared/speech/context';

type Callbacks = { onDone: () => void; onError: () => void };
export type SpeechDriver = {
  maxLength: number;
  stop: () => Promise<void>;
  speak: (text: string, language: string, callbacks: Callbacks) => void;
};

/** Cancel queued utterances and callbacks before moving to another question. */
export function createSpeechService(driver: SpeechDriver): SpeechService {
  let version = 0;
  return {
    async speak(text, language, callbacks) {
      const request = ++version;
      await driver.stop();
      if (request !== version) return;
      driver.speak(text.slice(0, driver.maxLength), language, {
        onDone: () => {
          if (request === version) callbacks.onDone();
        },
        onError: () => {
          if (request === version) callbacks.onError();
        },
      });
    },
    async stop() {
      version++;
      await driver.stop();
    },
  };
}
