import { useReducer, useState } from 'react';
import type { LearningDeck } from '@/domain/content/learning';
import { createLocalId } from '@/shared/utils/local-id';
import { buildDeckDraft } from '../model/deck-draft';
import { createDeckEditor, isDeckEditorDirty, updateDeckEditor } from '../model/deck-editor';

export function useDeckDraft(onSave: (deck: LearningDeck) => void) {
  const [draft, dispatch] = useReducer(updateDeckEditor, undefined, createDeckEditor);
  const [deckId] = useState(() => createLocalId('deck'));
  const [invalid, setInvalid] = useState(false);
  const save = () => {
    const deck = buildDeckDraft(deckId, draft.title, draft.subject, draft.cards, draft.questions);
    setInvalid(!deck);
    if (deck) onSave(deck);
  };
  return { draft, dispatch, invalid, dirty: isDeckEditorDirty(draft), save };
}
