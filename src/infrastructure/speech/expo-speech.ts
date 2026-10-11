import * as Speech from 'expo-speech';
import { createSpeechService } from './speech-service';

/** A new request invalidates any queued speech from the previous question. */
export const speechService = createSpeechService({
  maxLength: Speech.maxSpeechInputLength,
  stop: () => Speech.stop(),
  speak(text, language, callbacks) {
    Speech.speak(text, {
      language,
      onDone: callbacks.onDone,
      onStopped: callbacks.onDone,
      onError: callbacks.onError,
    });
  },
});
