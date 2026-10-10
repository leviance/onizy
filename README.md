# Onizy

A React Native learning app for **Android and iOS**, built with Expo, strict TypeScript and Expo Router. Screens include onboarding, sign-in/registration, Home, the library, deck creation, flashcards, quizzes, spaced review and progress.

Tap a card to flip it; swipe left/right to record recall and advance automatically. Quizzes offer immediate feedback or feedback after submitting the entire quiz. Screens share the components in `src/design-system`.

## Run the app

Use the Node.js version in `.nvmrc` and npm 11. Dependencies are pinned by `package-lock.json`.

```powershell
npm.cmd ci
npm.cmd start
```

Scan the QR code on a phone using Expo Go compatible with SDK 57. The computer and phone must be able to reach each other. No environment variables are currently required.

```powershell
npm.cmd run android
npm.cmd run ios
npm.cmd run preview -- --port 8082
```

`android` opens a configured device/emulator; `ios` requires macOS and Xcode. On Windows, use a physical iPhone with Expo Go. `preview` runs React Native Web locally for visual checks; release platforms are Android/iOS. On macOS/Linux, use `npm` instead of `npm.cmd`.

Development pre-fills `dev@onizy.test` / `OnizyDev123!`; tap **Sign in** to open Home. This local test account works only with `__DEV__` enabled. Release builds neither pre-fill nor accept it, including when entered manually. Sample decks and Home preview statistics, streak and daily goal are also restricted to `__DEV__`. Release starts with an empty library and Home displays user-created learning data.

## Languages

English and Vietnamese are available throughout the interface. Choose a language in the Profile tab, which also offers **Follow device language**. The explicit choice is stored on this device; otherwise, the app selects the first supported device language, falling back to Vietnamese.

`src/shared/i18n` uses i18next and react-i18next for reactive translations, interpolation and plural forms; `Intl` formats numbers and dates. Language changes preserve form input and study progress. Built-in examples are available in both languages. User-created learning content retains its original language.

To add a language, create `locales/<code>.ts` with the English dictionary's `TranslationMessages` contract, translate all keys and the plural forms required by that language, and register its native name, formatting tag and messages in `resources.ts`. Add the language code to `expo-localization.supportedLocales` in `app.config.ts`. The picker and device detection use the registry automatically. Run the resource validation tests and check long labels on a phone. Keep all project documentation in English.

## Structure

| Directory            | Responsibility                                            |
| -------------------- | --------------------------------------------------------- |
| `src/app`            | Expo Router routes and navigation                         |
| `src/application`    | Providers, sample data and module composition             |
| `src/features`       | Feature screens, private components and interaction state |
| `src/domain`         | Plain TypeScript business types and rules                 |
| `src/infrastructure` | Storage adapters and future API integrations              |
| `src/design-system`  | Shared tokens, components and brand asset declarations    |
| `src/shared`         | i18n, hooks and general utilities                         |
| `assets`             | Logos, mascots, illustrations and native icons            |
| `scripts`            | Preview, structure checks and test execution              |
| `tests/e2e`          | Reserved for automated Android/iOS tests                  |

Implemented features: `auth`, `home`, `library`, `onboarding`, `progress`, `settings`, `study`. `ai-generation`, `import-export` and `inbox` remain reserved for future work. `.gitkeep` preserves empty reserved directories in Git.

Core documentation:

- [Feature requirements](docs/product/requirements.md).
- [Design specification](docs/design/DESIGN.md).
- [Architecture and development rules](docs/engineering/architecture.md).
- [Asset performance rules](CODEX.md).

## Checks

```powershell
npm.cmd run check
npm.cmd run doctor
npm.cmd run bundle:check
```

`check` validates structure/imports/assets/links, PNG dimensions/density variants/byte budgets, TypeScript, ESLint, Prettier and all unit tests. Run `npm.cmd run check:assets` for asset checks alone. `npm.cmd test` discovers co-located `*.test.mjs` files in `src`; run subsets with `test:auth`, `test:design` and `test:learning`. `doctor` checks Expo configuration and dependencies. `bundle:check` exports Android/iOS bundles into `dist`; it does not create APK/IPA files.

On phones, verify onboarding → sign-in → Home → Library → study → results; form keyboards and scrolling; flashcard taps/swipes; both quiz feedback modes; language switching and persistence after restart; large text, safe areas, TalkBack/VoiceOver and Reduce Motion. Release builds must disable the development account. There is no native E2E runner yet.

## Current scope

New learning content, results and suggested review schedules are held in memory and lost on closing/reloading the app. Home uses illustrative statistics in Development and actual learning data in Release. The 10-minute/1-day review suggestion is not FSRS. Language preferences are persisted separately. Backend authentication, durable learning storage, AI and the Chrome Extension are not implemented; service actions show availability notices.

Native `android/` and `ios/` projects are generated from `app.config.ts` and config plugins and are ignored by Git. Before the first native build, choose `android.package` and `ios.bundleIdentifier`; express native changes through configuration/plugins. Launcher icon changes require rebuilding/reinstalling. `.gitignore` excludes dependencies, caches, bundles and signing keys; `.gitattributes` standardizes LF line endings.
