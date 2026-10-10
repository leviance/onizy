import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import type { LearningDeck } from '@/domain/content/learning';
import { defaultDeckPreference, updateDeckPreference } from '@/domain/content/deck-library';
import type { LibraryFolder, LibraryPreferences } from '@/domain/content/deck-library';
import type { SessionRecord } from '@/domain/review/learning-session';
import { addLearningDeck, recordLearningSession } from '@/domain/review/learning-state';
import type { LearningState } from '@/domain/review/learning-state';

import { createInitialLearningData, localizeDemoDeck } from '../data/learning-decks';
import { useTranslation } from '@/shared/i18n';

type LearningContextValue = LearningState & {
  libraryPreferences: LibraryPreferences;
  toggleFavorite: (id: string) => void;
  moveToFolder: (id: string, folder: LibraryFolder) => void;
  addDeck: (deck: LearningDeck) => void;
  completeSession: (record: SessionRecord) => void;
};
const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: PropsWithChildren) {
  const { locale } = useTranslation();
  const initialData = useMemo(() => createInitialLearningData(__DEV__), []);
  const [state, setState] = useState<LearningState>(initialData.state);
  const [libraryPreferences, setLibraryPreferences] = useState<LibraryPreferences>(
    initialData.preferences,
  );
  const toggleFavorite = useCallback(
    (id: string) => {
      setLibraryPreferences((previous) =>
        updateDeckPreference(state.decks, previous, id, {
          favorite: !(previous[id] ?? defaultDeckPreference).favorite,
        }),
      );
    },
    [state.decks],
  );
  const moveToFolder = useCallback(
    (id: string, folder: LibraryFolder) => {
      setLibraryPreferences((previous) =>
        updateDeckPreference(state.decks, previous, id, { folder }),
      );
    },
    [state.decks],
  );
  const addDeck = useCallback(
    (deck: LearningDeck) => setState((previous) => addLearningDeck(previous, deck)),
    [],
  );
  const completeSession = useCallback(
    (record: SessionRecord) => setState((previous) => recordLearningSession(previous, record)),
    [],
  );
  const value = useMemo(
    () => ({
      ...state,
      libraryPreferences,
      toggleFavorite,
      moveToFolder,
      decks: state.decks.map((deck) => localizeDemoDeck(deck, locale)),
      addDeck,
      completeSession,
    }),
    [state, addDeck, completeSession, locale, libraryPreferences, toggleFavorite, moveToFolder],
  );
  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('LearningProvider is required.');
  return context;
}
