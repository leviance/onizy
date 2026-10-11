import { useEffect, useRef, useState } from 'react';
import { locales, useTranslation } from '@/shared/i18n';
import { useSpeechService } from '@/shared/speech/context';

export function useQuestionSpeech(questionId: string, text: string) {
  const service = useSpeechService();
  const { locale } = useTranslation();
  const key = questionId + ':' + locale;
  const [status, setStatus] = useState({ key, playing: false, failed: false });
  if (status.key !== key) setStatus({ key, playing: false, failed: false });
  const playing = status.key === key && status.playing;
  const failed = status.key === key && status.failed;
  const request = useRef(0);
  useEffect(() => {
    const generation = request;
    return () => {
      generation.current++;
      void service?.stop().catch(() => {});
    };
  }, [questionId, locale, service]);
  const toggle = () => {
    if (!service) return;
    const current = ++request.current;
    if (playing) {
      setStatus({ key, playing: false, failed: false });
      void service.stop().catch(() => {
        if (current === request.current) setStatus({ key, playing: false, failed: true });
      });
      return;
    }
    setStatus({ key, playing: true, failed: false });
    const done = () => {
      if (current === request.current) setStatus({ key, playing: false, failed: false });
    };
    const error = () => {
      if (current === request.current) {
        setStatus({ key, playing: false, failed: true });
      }
    };
    void service.speak(text, locales[locale].tag, { onDone: done, onError: error }).catch(error);
  };
  const stop = () => {
    request.current++;
    setStatus({ key, playing: false, failed: false });
    void service?.stop().catch(() => {});
  };
  return { available: !!service, playing, failed, toggle, stop };
}
