import assert from 'node:assert/strict';
import test from 'node:test';
import { createSpeechService } from './speech-service.ts';

const callbacks = { onDone() {}, onError() {} };
test('a newer question invalidates queued speech while stopping the previous utterance', async () => {
  const stops = [];
  const spoken = [];
  const service = createSpeechService({
    maxLength: 100,
    stop: () => new Promise((resolve) => stops.push(resolve)),
    speak: (text) => spoken.push(text),
  });
  const first = service.speak('old question', 'en-US', callbacks);
  const second = service.speak('new question', 'vi-VN', callbacks);
  stops[1]();
  await second;
  stops[0]();
  await first;
  assert.deepEqual(spoken, ['new question']);
});
test('leaving a question prevents a pending utterance from starting', async () => {
  let resolveFirst;
  let stopped = 0;
  let spoke = false;
  const service = createSpeechService({
    maxLength: 100,
    stop: () =>
      ++stopped === 1
        ? new Promise((resolve) => {
            resolveFirst = resolve;
          })
        : Promise.resolve(),
    speak: () => {
      spoke = true;
    },
  });
  const queued = service.speak('question', 'en-US', callbacks);
  await service.stop();
  resolveFirst();
  await queued;
  assert.equal(spoke, false);
});
test('stale native callbacks cannot update the next question and input respects the native limit', async () => {
  const utterances = [];
  let oldEvents = 0;
  const service = createSpeechService({
    maxLength: 4,
    stop: async () => {},
    speak: (text, language, hooks) => utterances.push({ text, language, hooks }),
  });
  await service.speak('long text', 'en-US', {
    onDone: () => oldEvents++,
    onError: () => oldEvents++,
  });
  await service.speak('next', 'vi-VN', callbacks);
  utterances[0].hooks.onDone();
  utterances[0].hooks.onError();
  assert.equal(oldEvents, 0);
  assert.equal(utterances[0].text, 'long');
  assert.equal(utterances[1].language, 'vi-VN');
});
