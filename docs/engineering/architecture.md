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

Screen-level top spacing uses the maximum of the device's top inset and the design spacing, rather than adding both. Focus screens apply `SafeAreaView`'s `maximum` edge mode. Home applies the maximum to scroll content so decorative backgrounds can reach the top edge; authentication applies it above the mascot while keeping ribbons at the edge. Manually managed scroll views disable automatic content inset adjustment. BottomNavigation manages its own bottom safe area.

Logos/mascots live in `assets/brand`, native icons in `assets/app-icons`, and feature illustrations in `assets/illustrations/<feature>`. Declare images in their owning module; `app.config.ts` references build assets directly.

Runtime PNGs use a base image sized for the intended dp dimensions, with matching `@2x`/`@3x` variants selected by React Native. Functional icons reuse inline SVG; design-specific generated icons follow the same PNG checks when explicitly requested by the owner. `check:assets` validates density dimensions and byte budgets; `check:structure` assigns variants to the base image's owner. Follow the [asset performance rules](../../CODEX.md) when adding artwork.

Co-located `*.test.mjs` files are discovered by `npm test`. Node runs plain TypeScript through type stripping; runtime imports between tested modules use relative paths ending in `.ts`. `npm run check` runs all checks. Android/iOS still require device verification of taps/swipes, keyboards, fontScale, safe areas, screen readers and locale changes across app restarts; bundle exports do not replace native tests.
