# Onizy development rules

- Read the [requirements](docs/product/requirements.md), [design](docs/design/DESIGN.md) and [architecture](docs/engineering/architecture.md) when changing the relevant area.
- Keep `src/app` routes thin. Feature UI belongs in `src/features`; consumers import through each feature's `index.ts`. Do not import directly between features.
- Keep plain TypeScript business rules in `src/domain`. Providers and module composition belong in `src/application`; API/storage adapters belong in `src/infrastructure` when implemented.
- Use tokens/components from `src/design-system`; preserve the owner's chosen BottomNavigation. Ask before changing shared components unless the user has already authorized that specific change.
- Android/iOS are the primary platforms. Flashcards use tap to flip and swipe to record recall and advance; prioritize phone interactions in verification.
- Write all project documentation in English. Put interface copy and accessibility labels in `src/shared/i18n/locales`, use `useTranslation()` in rendered components, and format dates/numbers with the active locale. Keep user-authored learning content unchanged when switching languages. Register new languages centrally and validate resource keys, placeholders and plural forms.
- Keep images in `assets`; declare brand images in `src/design-system/assets` and feature images in `src/features/<feature>/assets`. Do not put previews or verification files among runtime assets.
- Follow [CODEX.md](CODEX.md) for mobile asset sizing, density variants, byte budgets and performance verification.
- Co-locate unit tests with their modules; reserve `tests/e2e` for device tests. Do not put helpers/tests in route directories.
- Preserve existing reserved directories with `.gitkeep`; add directories only when needed.
- Concentrate documentation in the root README and the three core documents in `docs`. Do not create per-directory READMEs, per-turn reports, prompts or repository preview images unless requested.
- Run `npm.cmd run check`. After changes to assets, entry points, configuration or native dependencies, also run `doctor` and `bundle:check`. Report the environment actually verified.
- Do not commit or push unless requested.
