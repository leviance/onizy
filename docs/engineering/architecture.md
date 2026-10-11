# Onizy architecture

Onizy is an Expo/React Native app using Expo Router, strict TypeScript and `StyleSheet`. UI standards are defined in [DESIGN.md](../design/DESIGN.md), and product rules in the [requirements](../product/requirements.md). See the [README](../../README.md) for running and checking the app.

## Source boundaries

| Layer            | Responsibility                                | Dependencies                                                       |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| `app`            | Routes, parameters and navigation             | application, feature public APIs, design-system, shared            |
| `application`    | Providers and module composition              | feature public APIs, domain, infrastructure, design-system, shared |
| `features`       | Screens, forms and interaction state          | the feature itself, domain, design-system, shared                  |
| `domain`         | Plain TypeScript business types and rules     | domain                                                             |
| `infrastructure` | API, storage and external service adapters    | domain, shared                                                     |
| `design-system`  | Shared tokens and UI                          | design-system, shared, UI libraries                                |
| `shared`         | Language support, hooks and general utilities | shared, utility dependencies                                       |

ESLint checks import boundaries, cycles, feature public APIs and declared dependencies. `domain` has no React, Expo, HTTP or storage dependencies. `application` instantiates API/storage adapters and injects required capabilities into features; screens do not access external data directly.

## Feature organization

Features expose their API through `index.ts` and use relative imports internally. Add `screens`, `components`, `hooks`, `model` and `assets` according to actual needs. Components private to a feature stay there; reusable UI belongs in `design-system`.

`app/application` composes features. Shared business rules belong in `domain`, while utilities without business meaning belong in `shared`. Empty reserved directories use `.gitkeep` and have no implementation yet.

## Current data

- `AppProviders` initializes fonts, safe areas, i18n and `LearningProvider`.
- `LearningProvider` keeps learning content, completed results, suggested review schedules, favorites and folder assignments in memory. It calls `domain/review/learning-state.ts` for validation and duplicate prevention. Library filtering and sorting live in `domain/content/deck-library.ts`; counts and progress use the same review summary as the study screens. Offline downloads and external imports are not connected.
- `learning-session.ts` handles flashcard/quiz sessions; `learning-statistics.ts` computes statistics; `review-summary.ts` keeps progress and due-card calculations consistent across screens.
- `review-queue.ts` builds the daily and multi-deck review queues from the same due/practice rules and computes completed-session streaks by local calendar day. `ReviewBatchScreen` snapshots card IDs at entry and saves a separate valid result for each completed deck. Completing one deck cannot change the scope of the remaining queue.
- Deck detail searches both card faces and question prompts, filters by content type, and displays actual schedules and completed sessions. Session setup keeps optional ordering controls collapsed; quizzes expose feedback timing before starting. Unanswered questions remain neutral before submission, and results provide answer review and targeted retries.
- Progress separates card recall activity from Quiz accuracy. Daily chart values come from completed card decisions; history groups completed sessions by local calendar day and opens results without recording them again. Practice content uses each question's latest attempt and the current card schedule, so a later correct response removes a question from the practice list.
- The deck editor uses a reducer and stable row IDs in `features/library/model`; authentication form state lives in `features/auth`. The development account is gated by `__DEV__` during both initialization and submission.
- Sample content in `application/data` and Home's illustrative counters, streak and daily goal are enabled only by React Native's `__DEV__` flag. Release initializes an empty library without sample folder assignments. Home receives learning state from the provider and calculates counts, review progress and today's activity from user-created content; its empty state offers deck creation. There is no backend, real authentication session, learning database or FSRS implementation.

Persistent learning storage will require schema migrations and account scoping. Store tokens in secure storage and service secrets on the backend. Adapters must handle errors, timeouts, cancellation and retries according to their contracts.

## Internationalization

`shared/i18n/resources.ts` registers supported languages, native names, formatting tags and dictionaries. English defines the typed resource contract, including additional plural categories for future languages; Vietnamese implements it. i18next handles interpolation, plural selection and fallback; react-i18next and a subscribed language preference store update rendered consumers without remounting forms or sessions.

`application` supplies device locale tags from `expo-localization` and the `infrastructure/storage/locale-storage.ts` AsyncStorage adapter. The preference store restores an explicit selection, otherwise follows the first supported device language, with Vietnamese as fallback. Writes are serialized; stale reads cannot overwrite a new selection. Storage failures leave the current language usable and expose a retry notice.

`useTranslation()` supplies `t`, `formatText`, localized number/percent/date formatters and language preference controls. UI copy and accessibility labels use resource keys. The settings feature provides a language selector injected by the Profile route rather than importing between features. Learning content authored by users is never translated automatically.

Add a typed dictionary and registry entry for each new language, declare native supported locales in `app.config.ts`, and supply the plural categories required by `Intl.PluralRules`. Resource tests check key parity, placeholders and plural coverage. Translation resources may contain their target language; documentation is always English.

## UI, assets and tests

Native tokens and shared components expose their public API through `src/design-system/index.ts`. Home uses Explore Mode; flashcards, quizzes and the editor use Focus Mode with fewer decorations.

Quiz setup and active layout belong to the study feature. `QuizScaffold` owns its top and bottom safe areas, an independently scrolling body and a fixed action footer. `ActiveSession` retains session transitions, recording and exit/submission confirmation; `ActiveQuiz` renders the question and navigation. `QuizQuestion` accepts optional presentation slots for a header action and feedback artwork without depending on feature assets. Marked question IDs are stored with the completed session and exposed as an answer-review filter. The default question layout remains available for result review.

`QuizSwipeQuestion` and `useQuizSwipe` handle horizontal navigation within the study feature, using Gesture Handler and Reanimated worklets. Vertical drags remain available to the scrolling body. Navigation is committed once after the outgoing transition; unmounting cancels the animation and discards its callback. The domain predicate `canNavigateQuizQuestion` enforces the same bounds and feedback rules for gestures, the footer and question navigation. Returning to earlier questions preserves answers and never records another attempt or submits the session.

The application injects a speech service through the shared speech context. Its infrastructure adapter uses `expo-speech`; requests invalidate previous queued utterances. The study hook stops reading when the question, interface language or mounted session changes and ignores stale callbacks. Reading uses the current interface locale and does not translate or rewrite learning content; language metadata per question is not yet supported.

`Flashcard` uses Gesture Handler and Reanimated worklets for horizontal drag feedback on Android/iOS. Both faces support recall swipes and equivalent accessibility actions; the session reducer does not require an answer reveal. A shared progress value drives the border, decision labels and session counters without React updates on every frame. Accepted releases update the visible count once before the outgoing animation finishes; the session reducer records the decision and advances once afterward. Generation checks discard callbacks from an unmounted or reset card. Vertical gestures remain available to the parent scroll view, and reduced motion skips rotation and settling transitions.

`useFlashcardFlip` animates a vertical flip with two card faces rotating around their centered horizontal axis on the UI thread. A second tap reverses the current rotation; recall swipes wait until the flip settles. The measured height of the larger face keeps the card's frame stable while accommodating long content and font scaling. Only the active content has an accessibility label, and reduced motion changes faces without a transition.

Screen-level top spacing uses the maximum of the device's top inset and the design spacing, rather than adding both. Focus screens apply `SafeAreaView`'s `maximum` edge mode. Home applies the maximum to scroll content so decorative backgrounds can reach the top edge; authentication applies it above the mascot while keeping ribbons at the edge. Manually managed scroll views disable automatic content inset adjustment. BottomNavigation manages its own bottom safe area.

Main screens share `useScrollNavigation`: downward scrolling hides the floating navigation, upward scrolling reveals it, and the top or non-scrollable content keeps it visible. A 4 dp direction threshold ignores jitter and clamped offsets ignore edge bounce. Reanimated scroll worklets detect direction and start a fixed 200 ms translation on the UI thread on Android/iOS. The bar consumes the shared animation progress directly; movement does not wait for a React render or track swipe distance. Reversals continue from the current position, and reduced motion removes the transition. Only a completed, current transition updates React padding and accessibility state; interrupted transitions cannot commit stale state. Bottom content padding reserves the measured navigation height and its 12 dp offset while shown; hidden navigation leaves 16 dp plus the bottom safe area. `Screen` applies its own bottom safe area, so its callers pass `bottomSafeAreaApplied` to the hook and use `bottomPadding` instead of trailing spacer views. The scroll model excludes navigation padding when checking direction and scrollability, preventing padding changes from toggling the bar. Vertical containers use `Animated.ScrollView`; horizontal carousels do not control navigation visibility.

Logos/mascots live in `assets/brand`, native icons in `assets/app-icons`, and feature illustrations in `assets/illustrations/<feature>`. Declare images in their owning module; `app.config.ts` references build assets directly.

The generated Onizy icon library lives in `assets/icons/<category>`. Its 154 base icons use transparent PNGs sized for 24 dp, with matching `@2x` and `@3x` density variants. The `library-editor/add` asset is exported for the larger 32 dp Create action. `design-system/assets/icon-library.ts` owns the static asset declarations and exposes typed names, source-label aliases and the default logical size through the design-system public API. Repeated source-sheet symbols share an alias. Consumers use `generatedIconAssets` with explicit dimensions and preserve each icon's accent colors; BottomNavigation tints the monochrome Create glyph for contrast on its orange button. The existing SVG `Icon` component remains available for functional icons.

Runtime PNGs use a base image sized for the intended dp dimensions, with matching `@2x`/`@3x` variants selected by React Native. Functional icons reuse inline SVG; design-specific generated icons follow the same PNG checks when explicitly requested by the owner. `check:assets` validates density dimensions and byte budgets; `check:structure` assigns variants to the base image's owner. Follow the [asset performance rules](../../CODEX.md) when adding artwork.

Co-located `*.test.mjs` files are discovered by `npm test`. Node runs plain TypeScript through type stripping; runtime imports between tested modules use relative paths ending in `.ts`. `npm run check` runs all checks. Android/iOS still require device verification of taps/swipes, keyboards, fontScale, safe areas, screen readers and locale changes across app restarts; bundle exports do not replace native tests.
