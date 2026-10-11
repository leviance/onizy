import type { SessionRecord } from './learning-session';

/** Daily card recall decisions; Quiz answers are a separate metric. */
export function studyActivity(records: readonly SessionRecord[], days: 7 | 30, now: number) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days + 1 + index);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const selected = records.filter(
      (record) =>
        record.mode !== 'quiz' &&
        record.finishedAt <= now &&
        record.finishedAt >= date.getTime() &&
        record.finishedAt < next.getTime(),
    );
    let remembered = 0;
    let again = 0;
    for (const record of selected)
      for (const id of record.itemIds) {
        if (record.decisions[id] === 'remembered') remembered++;
        if (record.decisions[id] === 'again') again++;
      }
    return { timestamp: date.getTime(), remembered, again, total: remembered + again };
  });
}
