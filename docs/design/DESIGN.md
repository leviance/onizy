# DESIGN.md — Playful Learning Design System

The React Native implementation of these standards lives in [src/design-system](../../src/design-system/index.ts); screens use shared components through its public API.

[React Native tokens](../../src/design-system/tokens/index.ts) map this document's values to the public API. The library currently provides a Light theme, mobile/wide typography, shared data states and single-column Focus Mode. Dark themes, desktop sidebars and components for unimplemented workflows need separate validation before expansion.

> **Version:** 1.0.0
> **Status:** Design specification / Single Source of Truth
> **Product:** Learning app with flashcards, quizzes, spaced repetition, AI and a Chrome Extension
> **Platforms:** Mobile-first (iOS/Android), Web and Chrome Extension
> **Inspiration:** References for Onboarding, Home and Leaderboard supplied by the project owner.
> **Interface languages:** Vietnamese and English, with extensible localization; Vietnamese is the fallback for unsupported device languages.

---

## 0. Purpose, scope and usage principles

This document defines **required design standards** for all product UI, rather than optional ideas. Designers, developers and AI UI generators must use the same tokens, components, layouts and interactions defined here.

**Goal:** Maintain a **playful, intelligent, friendly and motivating** experience, clear enough for sustained learning without eye strain.

**Priority when requirements conflict:**

1. Usability, accessibility and accurate learning data.
2. Consistency with tokens and reusable components.
3. Readability, contrast and interaction states.
4. Similarity to reference images.
5. Decoration, motion and gamification.

**Style keywords:** `Playful`, `Bold`, `Friendly`, `Neo-brutalism lite`, `Illustrated`, `Rounded`, `Energetic`, `Clean`.

**Avoid:** cold blue/purple SaaS dashboards; glassmorphism as the main style; full-screen gradients; heavy shadows; square rectangular cards; mascots copied from references; dense decoration on focused study screens.

**Distinction:** References establish **art direction**, rather than pixel-perfect wireframes. Preserve the cream canvas, prominent orange, bold rounded typography, 2D cartoons, generously rounded cards, intentional black elements and geometric decorative strokes.

---

## 1. Visual analysis of the references

| Element | Characteristic | Standard |
|---|---|---|
| Overall | Warm cream white, ample breathing room | Default `surface.canvas`, white cards |
| Primary color | Vivid coral orange | `brand.primary = #F8672B` |
| Secondary colors | Orange yellow and neon green | Accents, illustrations, achievements only |
| Text | Near-black | Bold headings; no pale gray primary content |
| Headings | Very bold, soft, rounded sans-serif | Nunito, weight 900 |
| Cards | Large rounded rectangles | Default `radius.card = 28px` |
| Buttons | Orange/white pills | `radius.pill = 999px` |
| Navigation | Black bar, orange active tab | Floating capsule bottom navigation |
| Illustration | Playful 2D vectors, black outlines | Independent system, thick strokes, flat colors |
| Leaderboard | Minimal 3D podium, round avatars | Flat UI combined with simple volumes |
| Decoration | Four-point stars, curves, diagonals | Limited accents that do not obstruct content |
| Surfaces | Mostly flat, subtle shadows | No glass as the main style |

> **Color note:** HEX values have been standardized from the references. Lighting, compression, display differences and anti-aliasing mean these are the **proposed official design palette**, rather than an exact reconstruction of the original design file.

### 1.1. The 70 / 20 / 10 principle

- About **70%** of the area: cream, white and negative space.
- About **20%**: primary orange for visual emphasis.
- About **10%**: black, yellow, green and other accents.
- This is **directional guidance**, not an exact measured ratio. Quizzes and flashcards may use even less color.

### 1.2. Two visual density modes

**Explore Mode:** Home, Onboarding, Category, Leaderboard, Achievement. Allows large illustrated banners, decorative stars, several accents and expressive typography.

**Focus Mode:** Flashcard, Quiz, Review Session, Editor, AI Preview. Minimize illustration and gamification; prioritize text, contrast, reading rhythm and touch/swipe controls. **Do not transfer Home's full visual intensity to study screens.**

---

## 2. Color System

### 2.1. Brand palette

| Token | HEX | Role | Notes |
|---|---|---|---|
| `brand.primary` | `#F8672B` | Primary orange | CTA, active state, banner |
| `brand.primaryHover` | `#ED581C` | Hover | Orange web buttons |
| `brand.primaryPressed` | `#D94A10` | Pressed | Press state |
| `brand.primarySoft` | `#FFF0E5` | Pale orange | Gentle highlights, chip background |
| `brand.primaryDeep` | `#B53A0A` | Deep orange | High-contrast white text when needed |
| `accent.sunny` | `#FFB51B` | Sunny yellow | Stars, badges, streaks, podium |
| `accent.sunnySoft` | `#FFF2C8` | Cream yellow | Reward label background |
| `accent.lime` | `#19F768` | Neon green | Illustration strokes, rewards, special states |
| `accent.limeSoft` | `#E7FFEE` | Pale green | Success background |
| `accent.ink` | `#111111` | Warm black | Text, icons, borders, bottom navigation |

**Key rule:** Neon `accent.lime` is **decorative and a secondary accent**; never use it for small text on white. Bright yellow is also unsuitable for primary text.

Home uses the extended Explore palette: canvas `#FFFDF6`, vivid orange `#FF531F`, yellow `#FFD21C`, green `#00DB68` and bright orange `#FF9833`. Values live in `colors.explore`; covers/icons have `colors.topic.*.highlight`. This Explore variant does not replace Focus semantic colors. See [React Native tokens](../../src/design-system/tokens/index.ts).

### 2.2. Neutral palette

| Token | HEX | Use |
|---|---|---|
| `surface.canvas` | `#F7F6F0` | App canvas |
| `surface.card` | `#FFFFFF` | Card, input, modal |
| `surface.warm` | `#FFF9F2` | Warm content areas |
| `surface.subtle` | `#F1F0EA` | Grouped background |
| `surface.disabled` | `#EBEAE5` | Disabled components |
| `text.primary` | `#111111` | Headings, content |
| `text.secondary` | `#575650` | Descriptions, supporting text |
| `text.tertiary` | `#76746F` | Secondary labels; check contrast |
| `text.inverse` | `#FFFFFF` | Black and deep orange surfaces |
| `border.strong` | `#111111` | Intentional outlines |
| `border.default` | `#DAD9D3` | Dividers and inputs |
| `border.subtle` | `#EDECE6` | Subtle card boundaries |

**Do not use** the background outside the three phones (`#E8EAEE`) as the product canvas. It belongs to the mockup presentation, not the app's identity.

### 2.3. Semantic colors

| State | Foreground | Background | Presentation |
|---|---|---|---|
| Success / Correct | `#176A3A` | `#E7FFEE` | Check icon and explicit text |
| Error / Incorrect | `#B42328` | `#FFF0EE` | X icon, correct answer, explanation |
| Warning | `#855400` | `#FFF2C8` | Warning icon and text |
| Info | `#2452A8` | `#EAF2FF` | Neutral notice |
| Selected | `#111111` | `#FFF0E5` | Clear border and pale orange background |
| Disabled | `#908E86` | `#EBEAE5` | Reduced emphasis and unavailable behavior |

Never signal correctness with color alone. **Combine at least two signals**, such as icon/text or icon/border.

### 2.4. Background and foreground rules

| Background | Preferred text | Conditions |
|---|---|---|
| Cream/white | `text.primary` | Default |
| Orange `#F8672B` | `#111111` | Default for small text and CTAs |
| Deep orange `#B53A0A` | `#FFFFFF` | Small text if measured contrast passes |
| Black `#111111` | `#FFFFFF` | Navigation, dark overlays |
| Yellow `#FFB51B` | `#111111` | Reward badges |
| Neon `#19F768` | `#111111` | Small accent blocks |

- Minimum target: **WCAG AA**, 4.5:1 for regular text and 3:1 for large text and interactive graphics; check applicable hover/selected/disabled states.
- White on bright orange may suit large reference headlines, but **must not become the default at every text size**.
- Avoid long text directly over illustrations or complex gradients.
- Do not use warning red for an “Again” review result that only indicates incomplete recall; avoid making learners feel punished.

### 2.5. Gradients

Use gradients only for podiums, awards, event posters or selected illustrations, never behind every card.

- `gradient.orangeReward`: `linear-gradient(180deg, #FFB51B 0%, #F8672B 48%, #D94A10 100%)`.
- `gradient.warmGlow`: `linear-gradient(135deg, #FFF6EC 0%, #FFFFFF 100%)`.
- For livelier backgrounds, use flat color blocks, curves and stars instead of multicolor gradients.

---

## 3. Typography

### 3.1. Official font

**Primary font: [Nunito](https://fonts.google.com/specimen/Nunito)**. Load weights `400`, `500`, `600`, `700`, `800`, `900` with Vietnamese character coverage.

Rationale: rounded, soft, readable shapes, Vietnamese support, and weights suitable for both bold headlines and focused body text.

**Fallback:** `Nunito, ui-rounded, system-ui, -apple-system, "Segoe UI", sans-serif`.

**Display accent (optional, not default):** Fredoka 600–700 only for key visuals/achievements after verifying Vietnamese characters. Do not change fonts arbitrarily between screens.

### 3.2. Type scale

| Token | Mobile size / line-height | Desktop size / line-height | Weight | Use |
|---|---|---|---|---|
| `type.display` | `44 / 48px` | `64 / 68px` | 900 | Onboarding heroes, campaigns |
| `type.h1` | `36 / 40px` | `48 / 54px` | 900 | Main headings |
| `type.h2` | `28 / 34px` | `36 / 42px` | 900 | Primary sections |
| `type.h3` | `22 / 28px` | `26 / 32px` | 800 | Card title, quiz title |
| `type.h4` | `18 / 24px` | `20 / 26px` | 800 | Lower-level headings |
| `type.bodyLg` | `17 / 26px` | `18 / 28px` | 600 | Questions, learning content |
| `type.body` | `16 / 24px` | `16 / 24px` | 500 | Regular text |
| `type.bodySm` | `14 / 21px` | `14 / 21px` | 500 | Metadata, descriptions |
| `type.caption` | `12 / 18px` | `12 / 18px` | 600 | Lower-priority captions |
| `type.button` | `16 / 20px` | `16 / 20px` | 800 | Primary buttons |
| `type.number` | `32 / 38px` | `40 / 46px` | 900 | Streaks, scores, results |

**Rules:**

- `h1/h2` may use `letter-spacing: -0.035em`; never compress body text.
- Multiline body text needs line-height of at least approximately 1.45 times its size.
- Limit headlines to 2–3 lines; avoid too much text at `font-weight: 900`.
- Long flashcard definitions should use `bodyLg` or `body`; **do not shrink text to 11–12px** to fit.
- English phrases, IPA, mathematical symbols and formulas must render reliably; use specialized fallback fonts when needed.
- No ALL CAPS in Vietnamese paragraphs; reserve it for intentional short labels.
- Plan wrapping for `vi-VN` and `en-US`; prefer natural wrapping and prevent text overflowing pills.

---

## 4. Spacing, Grid, Sizing and Safe Area

### 4.1. Spacing scale (4px base)

| Token | Value | Use |
|---|---|---|
| `space.0` | `0` | No gap |
| `space.1` | `4px` | Closely associated icon/text |
| `space.2` | `8px` | Internal chip gaps |
| `space.3` | `12px` | Small information rows |
| `space.4` | `16px` | Common component gaps |
| `space.5` | `20px` | Small card padding |
| `space.6` | `24px` | Mobile screen padding |
| `space.8` | `32px` | Between content groups |
| `space.10` | `40px` | Between major sections |
| `space.12` | `48px` | Heroes, extra breathing room |
| `space.16` | `64px` | Large desktop gaps |

### 4.2. Mobile layout

- Baseline **390 × 844px**, supporting viewports down to **320px** without fixed-height dependencies.
- Side padding defaults to `20px`, or `24px` at widths ≥390px; study screens may use `16–20px` for more content space.
- Section gaps: `28–32px`; internal gaps: `12–16px`.
- Long reading text on the web has a maximum width of approximately `680px`.
- The body scrolls independently of bottom navigation; navigation must not cover the last content.
- Use `env(safe-area-inset-*)` for notches, Dynamic Island and gesture bars; do not hardcode iPhone status bars.
- The platform manages status bars. Mockups may show one, but **do not build fake status bars in the app**.

### 4.3. Tablet and desktop layout

| Viewport | Suggested structure | Padding |
|---|---|---|
| `< 600px` | Single column, floating bottom navigation | 16–24px |
| `600–899px` | Wide single column / two-column library | 24–32px |
| `900–1199px` | Sidebar and main area | 32px |
| `≥ 1200px` | Sidebar, bounded content, optional secondary panel | 40–48px |

- Desktop shells limit main content to about `1200px`; focused quizzes use `680–820px`.
- Library grids use `repeat(auto-fit, minmax(240px, 1fr))`, not four fixed columns.
- Desktop may offer secondary progress/AI panels, but **not every screen needs a right panel**.
- Chrome Extension layouts are separate; do not simply shrink the desktop app.

---

## 5. Shapes, Borders and Shadows

### 5.1. Border radius

| Token | Value | Use |
|---|---|---|
| `radius.xs` | `8px` | Small inline badges |
| `radius.sm` | `12px` | Tooltip, dropdown option |
| `radius.md` | `16px` | Input, mini card |
| `radius.lg` | `20px` | Quiz answer, item tile |
| `radius.card` | `28px` | Standard cards |
| `radius.hero` | `32px` | Category hero, banner |
| `radius.modal` | `32px` | Dialog, bottom sheet |
| `radius.pill` | `999px` | CTA, tag, navigation |

### 5.2. Borders

- `border.subtle`: `1px solid #EDECE6` for subtle cards/dividers.
- `border.default`: `1.5px solid #DAD9D3` for ordinary inputs/items.
- `border.strong`: `2px solid #111111` for selected answers and special outlined cards.
- `border.illustrative`: `3px solid #111111` for mascots, comic-like badges or game objects.
- **Do not outline every card in thick black**; references emphasize outlines on icons, bottom navigation and selected special elements.

### 5.3. Elevation

- `shadow.soft`: `0 4px 14px rgba(17,17,17,.06)` for lightly elevated cards.
- `shadow.float`: `0 10px 30px rgba(17,17,17,.13)` for floating navigation/menus.
- `shadow.pop`: `0 6px 0 rgba(17,17,17,.9)` for occasional arcade CTAs/game objects.
- `shadow.overlay`: `0 18px 52px rgba(17,17,17,.18)` — modal.
- Dialog backdrops use `rgba(17,17,17,.45)`; do not replace the interface with glassmorphism.

---

## 6. Iconography, Illustration and Graphic Motifs

### 6.1. Icon

- Use one consistent library: **Lucide** or an equivalent set with uniform strokes.
- Sizes: `18px` inline, `20px` secondary, `24px` navigation, `28px` feature hero.
- UI strokes: `stroke-width: 2–2.25`; avoid mixing 1px and 3px icons in one row.
- Active navigation may use consistently designed filled/solid variants; do not mix icon families.
- Icons do not replace important action labels unless clear tooltips/accessible labels exist.
- Do not use operating-system emoji as official UI icons. Emoji may appear in user-authored or suitable learning content.

### 6.2. Art direction: 2D illustration

**Style:** modern cartoons, 2D vectors, bold black outlines, flat colors, slightly exaggerated heads/actions, cheerful expressions, little texture. Capture the references' playful spirit; **do not copy their specific book-with-glasses character, scientist or avatars**.

**Illustration palette:** orange, yellow, cream, black, green; add secondary colors only to distinguish topics. Generated images must belong to the project or have appropriate usage rights.

**Applications:**

- Onboarding: one large topical illustration, about 45–55% of usable content height.
- Category tiles: one large character/prop occupying 35–55% of the card.
- Empty states: small illustration and clear message; do not make the page resemble an error.
- Quiz/Flashcard: **do not insert a permanent mascot** into the question area.
- Achievements: stars, stickers, minimal confetti and achievement metrics.

### 6.3. Brand motifs

A consistent shape family:

1. **Four-point sparkle:** 8–20px, orange/yellow.
2. **Squiggle:** wave-shaped stroke, 6–10px, rounded caps.
3. **Corner arc:** large quarter-circle extending slightly beyond a poster/card edge.
4. **Diagonal bands:** yellow/orange corner bands, at most one group per large block.
5. **Dot/coin:** small circles for achievements/streaks.

**Limit:** average 2–4 motifs per mobile screen; never cover text, buttons or learning progress. Do not add shapes merely to fill empty space.

---

## 7. Component System

Every screen must use reusable components; do not redesign buttons, cards, badges, tabs or modals per screen.

### 7.1. Button

| Variant | Background | Text | Outline | Use |
|---|---|---|---|---|
| `primary` | `brand.primary` | `text.primary` | None | Start learning, confirm, create deck |
| `primary-contrast` | `brand.primaryDeep` | White | None | CTAs requiring white text |
| `dark` | `accent.ink` | White | None | Primary actions on pale surfaces with much orange |
| `secondary` | White | `text.primary` | 2px black | Prominent secondary actions |
| `soft` | `brand.primarySoft` | `text.primary` | None | Light actions, filters |
| `ghost` | Transparent | `text.primary` | None | Text actions, back |
| `danger` | Pale red | Deep red | None | Deletion or leaving a session with confirmation |

**Sizes:** `sm = 36px`, `md = 44px`, `lg = 52px`, `xl = 56px`. Mobile primary actions default to `52px`. Touch targets are at least `44 × 44px`, including icon-only buttons.

**States:** default, desktop hover, pressed, focus-visible, loading, disabled. Loading preserves width with an internal icon/spinner and no layout jumps. Disabled buttons have no fake hover behavior.

**Rule:** most screens have **one** highest-priority `primary` action; establish a clear hierarchy for competing actions. Long CTAs may wrap to two lines or use shorter copy.

### 7.2. Card

| Component | Appearance | Required content |
|---|---|---|
| `BaseCard` | White, radius 28, padding 20–24 | Clear content hierarchy |
| `DeckCard` | White, topic cover/icon | Name, card count, progress, CTA |
| `CategoryHeroCard` | Orange/yellow or illustrated brand surface | Category, short description, play button |
| `DailyGoalCard` | White/cream, orange progress | Goal, completed amount, today's status |
| `ReviewDueCard` | Pale background, prominent number | Due-card count, start action |
| `StatCard` | Compact block, minimal decoration | Metric, label, comparison period if available |
| `AchievementCard` | Yellow accent, badge icon | Achievement, criteria, date earned |
| `VideoVocabularyCard` | White, source metadata | Word/phrase, context, video source, timestamp |
| `AIResultCard` | White, AI badge | Content, editing capability, source if available |

Interactive cards require `hover`, `focus-visible`, `pressed`. Noninteractive cards **must not** use pointer cursors or lift on hover.

### 7.3. Inputs and controls

- **TextField:** height `52px`, radius `16px`, 1.5px border, `text.tertiary` placeholder; labels stay outside inputs when meaning must remain visible during entry.
- **SearchField:** height `52px`, white surface, left search icon, right clear action; separate results/empty/loading states.
- **Textarea / Editor:** radius `16px`, sensible auto-growth, deep orange or black focus border plus focus ring, visible length limit.
- **SegmentedControl:** black or pale gray track, orange active segment; height 40–44px. For Today/Week/Month and Flashcard/Quiz.
- **FilterChip:** 36–40px pill; pale orange active background and border/checkbox, not just a text change.
- **Checkbox / Radio:** 20–24px indicator, entire row clickable, clear labels.
- **Toggle:** neutral off, orange/black on; always a static label.
- **ProgressBar:** height 8–12px, `surface.subtle` track, orange fill, pill radius; text progress on study screens.
- **Tab:** at most four horizontal mobile tabs; use scrollable tabs with an overflow cue for more.
- **Avatar:** 36/44/64px circles; orange/yellow selected/winner frames, contrasting initials fallback.
- **Badge:** height 24–28px, 12–13px text, weight 800, pill; status icon if needed.
- **Toast:** near content top or above bottom navigation, clear text, sufficient reading time; important errors offer retry.
- **Modal/BottomSheet:** radius 28–32, clear heading/CTA, swipe dismissal for nondestructive actions, safe-area compliance.

### 7.4. Navigation

**Mobile Bottom Navigation**, inspired by the reference's black bar:

- Shell: `#111111`, radius `999px`, height approximately `60–64px`, padding 5–6px.
- Floating bar: `16px` side margins, bottom `12px + safe-area-inset-bottom`, max-width `440px`, centered.
- Active item: `brand.primary` pill, icon/label, black text for contrast. Inactive: white background, black icons, labels hidden if space is insufficient.
- Icon-only items require `aria-label`, tooltips where supported, and ≥44px touch targets.
- At most **4–5 main destinations**. At 320px, if five items cannot retain 44px targets, use four plus the remaining destination in Profile/More. Do not shrink targets or force eight items.

**Suggested mobile sitemap:** `Home` · `Library` · `Review` · `Ranking` · `Profile`.

- `Create` may be a contextual FAB or Library CTA rather than a separate destination if the bar becomes crowded.
- Prefer contextual header/profile access for `Notifications`, `Search`, `Settings`.
- Immersive study screens may **hide bottom navigation**, replacing it with a Back/progress/menu header and a clear exit.

**Desktop:** replace bottom navigation with a 232–264px cream/white left sidebar; pale orange selected items with orange/black emphasis. Topbar: search, notifications, avatar. Do not show a large sidebar and floating navigation simultaneously.

**Chrome Extension:** compact header plus tabs/subscreens; never force a five-item floating bar into a small popup.

### 7.5. Standardized icons and component states

Every reusable component needs at least:

`default` · `hover` where applicable · `focus-visible` · `pressed` · `selected` · `disabled` · `loading` · `error` where applicable.

Do not invent inline colors, shadows or radii because a variant is missing. Add new variants to the design system first.

---

## 8. Screen Architecture & UX Patterns

### 8.1. Onboarding (3–4 slides)

**Goal:** communicate benefits in 5–15 seconds; engaging illustration, short text, no registration friction.

**Structure:**

1. Illustration occupies approximately 45–55% of the content area.
2. Short pagination indicator, orange selection.
3. 36–44px headline, weight 900, at most 2–3 lines.
4. 14–16px supporting text, at most three lines.
5. Bottom pill CTA; clear Skip/Sign in where needed.

**Example copy:**

- Slide 1: “Learn a little. Remember for longer.”
- Slide 2: “Turn knowledge into flashcards.”
- Slide 3: “Review on time. Improve every day.”
- Slide 4: “Learn from videos, documents and AI.”

Avoid fast autoplay carousels; pagination reflects the actual slide count; all actions support screen readers and swipes.

### 8.2. Home / Dashboard

**Top-to-bottom structure:**

1. Personalized header: avatar, short greeting, notifications.
2. SearchField: “Find decks, questions, topics…”
3. Signature heading: “What will you learn today?” (short, bold h1).
4. `ReviewDueCard`: due-card count and “Review now”. **Always prioritized when cards are due.**
5. Illustrated `CategoryHeroCard` banner / featured game mode.
6. “Continue learning”: active decks.
7. “Explore”: popular or suggested topics.
8. Bottom navigation.

Avoid tall banners that routinely push `Review now` below the fold. On short screens, prioritize review over banners.

### 8.3. Library / Collections

- Header: title, Search, `+ Create deck`.
- Segmented tabs: `Mine` · `Saved` · `Learning`, based on actual data.
- Filters: topic, updated time, mastery, course.
- Each `DeckCard`: name, cover/icon, card count, due count, progress, overflow menu.
- One-column grid on small phones; two columns when space permits; 3–4 desktop columns depending on width.
- Dedicated empty illustration and “Create your first deck”.
- Avoid excessive DeckCard buttons; tapping the card is the primary open action.

### 8.4. Deck Detail

**Goal:** make content, progress, study methods and next actions immediately clear.

- Title, topic cover/icon, description, author/access permissions.
- Metrics: total cards, due, mastered, recently updated.
- Main CTA: `Review cards` or `Start learning` by state; secondary: `Take quiz`.
- Mode chips: `Flashcards`, `Learn`, `Test`, `Match`; show supported modes only.
- Card list with preview, search and filters.
- Menu: edit, share, export, copy, delete according to permissions.
- `AI generated`, `Reviewed`, `Community` badges where appropriate to the source.

### 8.5. Flashcard Session — Focus Mode

**Layout:**

- Header: Back, `Card 4 / 20`, menu, progress bar.
- Centered flashcard: white, radius 28–32, flexible height; intentionally centered term/question.
- Back: definition, pronunciation for vocabulary, examples, notes, media and source.
- Small “Tap to flip” indicator / flip icon, using little space.
- Taps flip the card vertically (top to bottom), rotating both faces around its centered horizontal axis using `motion.flip` (420 ms). The return flip reverses direction; a tap during the transition retargets it from the current angle. Both faces share the larger content height, and reduced motion switches faces immediately.
- Phone flow: tap to flip when needed; swipe either face left for `Needs review` or right for `Remembered`, then advance. Viewing the answer is optional. These decisions have no separate onscreen buttons, and swipe hints and equivalent accessibility actions are available on both faces.
- Session counters show `Learning` and `Know`. Horizontal drag progress blends the card border, decision label and matching counter toward the semantic error or success colors. Only an accepted release increments its counter; cancelled or short drags restore the neutral appearance. The count updates on release and the next card appears after the outgoing animation.
- `ReviewRating` provides four levels for a separate advanced SRS mode when needed: `Again` · `Hard` · `Good` · `Easy`, with scheduler-provided intervals.

**Interaction:** prioritize Android/iOS taps and swipes. Short swipes restore the card; vertical scrolling never records recall. Long content must not be confined to a fixed-height, unscrollable card. Desktop keyboard checks supplement the web preview only.

**Accessibility:** equivalent flip control/label, native accessibility actions for decisions, reduced motion support; readers announce the current face, not both at once.

### 8.6. Quiz / Multiple-Choice Session — Focus Mode

- Header: Back, progress, timer in timed modes.
- Cream/white `QuestionCard` or question block; small question number above, 18–22px text depending on content.
- `AnswerOption`: minimum height 60px, radius 18–20, 12px gaps.
- Each answer has A/B/C/D or a checkbox and wrapping content.
- Single-choice selects one; multi-choice allows several with clear labeling.
- Checking through `Check` or automatically on selection **must be consistent within each mode**.
- Feedback: icon/text, explanation, correct answer, link to the source flashcard when available.
- Bottom CTA: `Continue` / `Finish`.

The mobile Quiz setup uses a small floating checklist illustration, deck title, question count, an approximate duration of 30 seconds per question, and two feedback timing options. Count and shuffle controls expand from the question-count row. The current implementation supports single-choice questions; other question types require their own domain and input support.

Active quizzes use a centered title and counter, an orange progress track, white answer cards with circular letter markers, and a fixed bookmark/continue action row above the device inset. The question body scrolls independently. Immediate feedback appears above the answers, with a compact illustration and a separate explanation below. Deferred feedback stays hidden until submission; the counter and answered summary open question navigation. Marked questions are available in the answer review after submission.

Swipe the question left to advance or right to return to the previous question. Answers and feedback remain attached to their question. Immediate mode requires an answer before advancing and keeps previous answers locked; deferred mode permits skipping and editing. Short or vertical gestures do not navigate. The first and last boundaries resist and return without exiting or submitting. Question-counter accessibility actions provide equivalent navigation, and reduced motion skips the slide transition.

Selected answers use the existing orange accent and pale orange background. Quiz feedback uses the approved reference accents `#00BE73` for correct markers/borders and `#F04452` for incorrect markers/borders inside `AnswerOption`; readable feedback text uses the existing semantic ink colors. An unselected correct answer keeps its neutral surface with a green check. These component-specific accents do not change the global palette or BottomNavigation.

**Answer states:** `idle`, `hover`, `selected`, `correct`, `incorrect`, `disabled`, `reviewed`. Lock answers after submission unless the mode explicitly allows changes.

### 8.7. Spaced Repetition / Daily Review

- Top: “Time to review!” with due-card count and a small chart of today's progress.
- Clear groups: `Due` · `New cards` · `Completed`.
- Session settings: card count, estimated duration where justified, deck selection.
- Prominent `Start review` CTA.
- After session: reviewed count, recall ratings, next due date based on the actual algorithm.
- Avoid pressure through red, negative wording or implying a broken streak is failure.
- With FSRS/SM-2 or any scheduler, **UI must not invent review intervals**; use actual scheduler data.

### 8.8. Quiz Result / Session Summary

**Visual reward:** stars, coins/badges and a small illustration; optional confetti for good completion.

**Required data:** correct/total, accuracy, study time if available, items needing review, progress save status.

**Primary CTA:** `Review mistakes` or `Keep learning`; **secondary:** `View answers` / `Back to library`.

Avoid intense celebration for weak results. Use encouraging copy with a concrete next step.

### 8.9. Leaderboard / Ranking

Preserve the visual spirit of the rightmost reference screen:

- `Leaderboard` header.
- SegmentedControl: `Today` · `This week` · `This month`.
- Simple-volume top-three podium; first tallest, second left, third right.
- Avatars, compact display names, clearly labeled XP/points.
- White pill ranking cards below: rank left, points right.
- The learner's position may be pinned when outside the top ranks.
- Ties and timestamps follow **actual system rules**, never arbitrary ordering.

**Privacy:** publish names/avatars/points according to appropriate user choices; allow opting out of rankings.

### 8.10. Create / Edit Deck

- Editor sections: deck information, question/answer pairs, tags/topics, visibility, save/publish.
- Item fields: term, definition, example, explanation, media where supported.
- Clearly placed `+ Add card`; desktop keyboard navigation.
- Save states: `Saving…` · `Saved` · `Could not save. Retry`.
- Reorder handle plus an alternative to dragging.
- Undo or confirmation for card/deck deletion when data loss is significant.
- Do not squeeze long input into small modals; use a full-screen mobile editor.

### 8.11. AI Generation / Import

**Standard flow:**

1. Source: `Enter text` · `Upload document` · `Paste link` where supported · `Saved video content`.
2. Output: `Flashcards`, `Quiz`, `Both`.
3. Settings: language, quantity, difficulty, topic, question type.
4. Real progress where available, otherwise transparent stages; no invented percentages.
5. `Preview & Review`: inspect items, edit, remove and selectively regenerate.
6. CTA: `Save to deck` or `Create new deck`.

**Required rules:**

- Label AI items `AI generated` during review; do not present them as verified knowledge.
- For permitted document/video sources, attach sources or excerpts when valid source data exists.
- Always allow edits before saving; explain AI can be wrong and needs checking.
- Handle excessive source length, unreadable content, quota limits, invalid AI output and duplicates.
- Show expected item counts and costs/credits if applicable **before confirmation**.

### 8.12. Vocabulary / Saved Words

A word saved from video should contain:

- Word/phrase and language.
- Phonetic transcription and pronunciation where supported.
- Meaning, part of speech, example or subtitle context.
- Source metadata: video/course, platform, timestamp, permitted reopen link.
- `Save to deck`, `Create flashcard`, `Add to review` actions.
- `Saved` state prevents unnoticed duplicate creation.
- For multiple meanings, let users choose the meaning **appropriate to the context**.

### 8.13. Chrome Extension / Video Subtitle Overlay

**Same brand, greater density than the mobile app.**

**Popup:**

- Suggested width `360–400px`; limited popup height with scrolling.
- Header: logo, connection/account state.
- Compact tabs: `Saved words` · `Options`.
- Recent words, search, `Open app` CTA.
- Same `Nunito`, orange, white cards, smaller radii (`12–20px`), no oversized illustrations.

**YouTube/Udemy/Coursera overlay where supported:**

- Contextual subtitle translation that does not obstruct important player controls.
- Bilingual or single-language mode; adjustable font size, position, background opacity and visibility.
- Selecting a word opens a mini popover with meaning, example, `+ Save word`.
- High-contrast white/black popovers, orange CTA; close to the selection but inside the viewport.
- Over colorful video, **prefer dark translucent text backgrounds** or clear text outlines; never put orange text directly over footage.
- Loading/error states for absent subtitles, unsupported platforms or inaccessible content.
- Respect user permissions, least privilege and platform terms; never promise all pages/videos without verification.

### 8.14. Profile / Settings / Progress

- Profile: avatar, display name, progress overview, badges, streak, study history.
- Settings: language, theme, notifications, daily goal, accessibility, saved data, privacy, export.
- Charts: clear axes, primary orange plus neutrals, redundant signals beyond color; small mobile charts need text summaries.
- Notifications: distinguish review reminders, deck updates and system notices; read/unread states.
- Streaks motivate without threatening users who take breaks.

---

## 9. Screen Templates (reusable layouts)

### Template A — Explore / Home

```text
┌──────────────────────────────────────┐
│ Avatar  Hello!        [Notifications] │
│                                      │
│ [ Search...                        ] │
│                                      │
│ What will you learn today?           │
│ ┌──────────────────────────────────┐ │
│ │ Review due • 18 cards   Review now│ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │    Category Hero + Illustration  │ │
│ │                      [ Start ]   │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Continue learning          View all  │
│ [Deck Card]     [Deck Card]          │
│                                      │
│       [Floating Bottom Nav]          │
└──────────────────────────────────────┘
```

### Template B — Study / Quiz (Focus)

```text
┌──────────────────────────────────────┐
│ [←]    Question 4/20         [•••]    │
│ [=============░░░░░░░░░░░░░░░░]      │
│                                      │
│ Question                             │
│ ┌──────────────────────────────────┐ │
│ │ Question content may be long...  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [ A. First answer                 ]  │
│ [ B. Second answer                ]  │
│ [ C. Third answer                 ]  │
│ [ D. Fourth answer                ]  │
│                                      │
│ [           Check answer          ]  │
└──────────────────────────────────────┘
```

### Template C — Editor / AI Review

```text
┌──────────────────────────────────────┐
│ [←]  Create deck          [Save]     │
│                                      │
│ Deck name                            │
│ [................................]   │
│                                      │
│ Card 1                      [Delete] │
│ [ Term                           ]   │
│ [ Definition                     ]   │
│ [ Example / context              ]   │
│                                      │
│ [           + Add card            ]  │
│                                      │
│ [          Save to library        ]  │
└──────────────────────────────────────┘
```

Templates describe **content hierarchy**, not fixed pixel measurements. Preserve action priorities and tokens across platform layout changes.

---

## 10. Interaction, Motion and Micro-interactions

### 10.1. Motion tokens

| Token | Duration | Use |
|---|---|---|
| `motion.fast` | `120ms` | Hover, press, colors |
| `motion.normal` | `200ms` | Chip, expand, navigation |
| `motion.slow` | `320ms` | Modal, sheet, hero |
| `motion.flip` | `420ms` | Flashcard 3D flip |
| `motion.celebrate` | `600–900ms` | Subtle achievements |

**Easing:** `cubic-bezier(.2,.8,.2,1)` for enter/move; `ease-out` for click feedback. Avoid strong bouncing during long study sessions.

### 10.2. Behavior patterns

- Button press: maximum scale `0.98`, no layout shift.
- Desktop card hover: translateY `-2px`, slightly stronger shadow.
- Page transitions: fade/translate 6–12px, not full-screen slides for every action.
- Flashcard flip: `rotateX(180deg)` with a nonanimated reduced-motion version.
- Correct: check icon, pale success background, clear feedback; no continuous shaking.
- Incorrect: clear explanation, no aggressive red shaking.
- Streak/XP: 0.5–0.8s count-up only if comfortable and not obscuring real data.
- Confetti: one short burst per milestone, not every correct answer.
- Skeleton: dimensions resembling real content, no intense shimmer, especially with reduced motion.

### 10.3. Reduced Motion

Khi `prefers-reduced-motion: reduce`:

- Disable 3D card flips, parallax, confetti and count-up.
- Reduce transitions nearly to zero; retain complete text/icon state changes.
- Disabling animation must not remove functionality.

---

## 11. Gamification Guidelines

**Use gamification to support learning, never to conceal actual knowledge progress.**

- **XP/Coins:** clear metrics, explanations of public scoring.
- **Streak:** yellow fire/star; not the sole measure of successful learning.
- **Badges:** at most three prominent levels per screen; others in achievements.
- **Leaderboard:** separate competition results from real recall.
- **Completion:** distinguish `viewed`, `practiced`, `mastered`; opening cards is not remembering them.
- **Mascot:** onboarding, encouragement, empty states; never intrude on focused questions/cards.

---

## 12. State Design: Required Coverage

Every important screen needs at least these states:

| State | UI requirement | Example |
|---|---|---|
| Initial | Hierarchy and realistic sample content | First Home visit |
| Loading | Contextual skeleton/spinner | Loading decks |
| Empty | Small illustration, explanation, next action | No decks |
| Success | Result confirmation and next step | Deck saved |
| Error | Specific message, useful retry | Sync failure |
| Offline | Connection state, feature limitations | Cannot load online deck |
| Partial | Data present but incomplete | Subtitles available, translation missing |
| No permission | Permission explanation and remedy | Extension access denied |
| Disabled | Reason action is unavailable | No answer selected |
| Overflow | Long text/names, many choices | Academic flashcards |
| Confirm destructive | Confirm data loss | Delete deck |
| Resume | Continue unfinished study | “Continue question 8/20” |

### 12.1. Example empty states

**No decks:** “Your library is waiting for its first deck.” · CTA `Create deck`.

**Nothing due:** “Great! Today's review is complete.” · CTA `Explore a new topic`.

**No search results:** “No matching content yet.” · CTA `Clear filters`.

**AI generation failed:** “Could not create cards from this content. Try a shorter or different source.” · CTA `Retry`.

**No subtitles:** “This video has no subtitles the extension can read.” · CTA `Try another video`.

---

## 13. Accessibility & Inclusive Design

**WCAG 2.2 AA is the main test target** for web UI and equivalent mobile/extension interactions.

- Minimum text contrast 4.5:1 regular, 3:1 large; focus/selection never depend solely on color.
- Visible focus border/ring ≥2px, appropriate offset, not clipped by overflow hidden.
- Internal touch target standard 44×44px, above some WCAG minimums, except suitably laid-out inline text links.
- Full keyboard support for quizzes, editors, modals, tabs, deck actions, extension popups.
- Modal focus management: move focus in on open, Esc closes where suitable, restore trigger focus on close.
- Appropriate quiz-result live regions; do not reread the whole page.
- Support 200% text zoom and narrow reflow without losing content or important controls.
- Hover must not be the only way to flip a card.
- Decorative illustrations use `aria-hidden`/empty alt; informative images need truthful descriptive alt.
- Video overlays offer text size, contrast and position options without hindering player controls.
- Avoid distracting audio/motion autoplay.
- Deadline/timer behavior must suit the mode and be clear from the start.

---

## 14. Responsive, Dark Mode and Localisation

### 14.1. Mobile-first

- Prioritize mobile gestures and thumb reach; retain mouse/keyboard alternatives on desktop.
- Keyboards must not cover CTAs; modals/textareas can scroll.
- Long quiz questions scroll; avoid fixed `height: 100vh`.
- Hide/adapt bottom navigation for keyboards where platforms require it.
- In landscape, avoid mascots taking the full height.

### 14.2. Dark Mode (when implemented)

**Do not simply invert colors or cover dark backgrounds in bright orange.** Suggested dark semantic tokens:

| Token | Light | Dark |
|---|---|---|
| `surface.canvas` | `#F7F6F0` | `#151515` |
| `surface.card` | `#FFFFFF` | `#242424` |
| `surface.subtle` | `#F1F0EA` | `#303030` |
| `text.primary` | `#111111` | `#F8F7F1` |
| `text.secondary` | `#575650` | `#C7C4BC` |
| `border.default` | `#DAD9D3` | `#464646` |
| `brand.primary` | `#F8672B` | `#FF8B58` |

Use black on dark-theme `brand.primary` when contrast permits; distinguish dark navigation from the canvas with borders/shadows. Test all text pairings and interaction states separately in dark themes.

### 14.3. Language & Content

- Follow the first supported device language unless the user chooses a language; use Vietnamese as the fallback. Localize all copy with i18n, never hardcode component text.
- Allow ~30–50% string expansion for longer translations.
- Use `Intl.NumberFormat`, `Intl.DateTimeFormat`; never hardcode `24.804`/`24,804` across locales.
- Respect timezone settings for streaks and schedules; due dates must match the user's actual displayed date.
- Do not mechanically represent languages with national flags.
- Handle mathematical notation, RTL and multilingual content separately when needed.

---

## 15. Content & Microcopy Tone

**Brand personality:** cheerful, proactive, encouraging, approachable without being overly childish or morally judging poor performance.

| Situation | Prefer | Avoid |
|---|---|---|
| Review pending | “You have 12 cards to review today.” | “You're falling behind!” |
| Incorrect quiz | “Not quite. Let's review it together.” | “Wrong! You're terrible!” |
| Completed | “You just completed 20 cards!” | “The universe's greatest genius!” |
| Empty | “No decks yet. Create your first one.” | “No data found.” |
| AI | “AI suggested 15 cards. Check them before saving.” | “15 absolutely correct answers.” |
| Save success | “Word saved to ‘English B1’.” | “Done.” |

- Use specific CTA verbs: `Review now`, `Create deck`, `Check answer`, `Save word`, `View explanation`.
- Avoid generic `Submit`, `OK`, `Continue` when specific wording is possible.
- Consistent terms: `Deck`, `Flashcard`, `Question`, `Review schedule`, `Mastered`, `Saved words`.
- Screen names may be friendly, but data/error labels must be **accurate**.

---

## 16. Design Tokens — CSS Source of Truth

Use semantic tokens in components. **Do not hardcode `#F8672B`, `28px` and `24px` across dozens of screens.**

```css
:root {
  color-scheme: light;

  /* Primitives / Brand */
  --color-brand-500: #f8672b;
  --color-brand-600: #ed581c;
  --color-brand-700: #d94a10;
  --color-brand-deep: #b53a0a;
  --color-brand-soft: #fff0e5;
  --color-yellow-500: #ffb51b;
  --color-yellow-100: #fff2c8;
  --color-lime-500: #19f768;
  --color-lime-100: #e7ffee;
  --color-ink: #111111;

  /* Semantic / Surface */
  --bg-canvas: #f7f6f0;
  --bg-card: #ffffff;
  --bg-warm: #fff9f2;
  --bg-subtle: #f1f0ea;
  --bg-disabled: #ebeae5;

  /* Semantic / Text */
  --text-primary: #111111;
  --text-secondary: #575650;
  --text-tertiary: #76746f;
  --text-inverse: #ffffff;

  /* Semantic / Borders */
  --border-strong: #111111;
  --border-default: #dad9d3;
  --border-subtle: #edece6;

  /* Feedback */
  --success-text: #176a3a;
  --success-bg: #e7ffee;
  --error-text: #b42328;
  --error-bg: #fff0ee;
  --warning-text: #855400;
  --warning-bg: #fff2c8;
  --info-text: #2452a8;
  --info-bg: #eaf2ff;

  /* Typography */
  --font-sans: "Nunito", ui-rounded, system-ui, -apple-system,
    "Segoe UI", sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Shape */
  --radius-xs: 8px;
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-card: 28px;
  --radius-hero: 32px;
  --radius-modal: 32px;
  --radius-pill: 999px;

  /* Elevation */
  --shadow-soft: 0 4px 14px rgb(17 17 17 / 6%);
  --shadow-float: 0 10px 30px rgb(17 17 17 / 13%);
  --shadow-pop: 0 6px 0 rgb(17 17 17 / 90%);
  --shadow-overlay: 0 18px 52px rgb(17 17 17 / 18%);

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 320ms;
  --duration-flip: 420ms;
  --ease-out-brand: cubic-bezier(.2, .8, .2, 1);

  /* App chrome */
  --bottom-nav-height: 64px;
  --content-max-width: 1200px;
  --study-max-width: 820px;
  --page-gutter: 20px;
}

@media (min-width: 390px) {
  :root { --page-gutter: 24px; }
}

@media (prefers-color-scheme: dark) {
  :root[data-theme="system"] {
    color-scheme: dark;
    --bg-canvas: #151515;
    --bg-card: #242424;
    --bg-warm: #292521;
    --bg-subtle: #303030;
    --text-primary: #f8f7f1;
    --text-secondary: #c7c4bc;
    --border-default: #464646;
    --border-subtle: #3a3a3a;
    --color-brand-500: #ff8b58;
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg-canvas: #151515;
  --bg-card: #242424;
  --bg-warm: #292521;
  --bg-subtle: #303030;
  --text-primary: #f8f7f1;
  --text-secondary: #c7c4bc;
  --border-default: #464646;
  --border-subtle: #3a3a3a;
  --color-brand-500: #ff8b58;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> **Dark Mode implementation note:** The CSS above illustrates core tokens, **not complete dark mapping**. Before officially enabling Dark, supply dark values for every semantic token, especially disabled, feedback, selected, strong borders and tertiary text, and test contrast. Until complete, lock to Light rather than shipping inconsistent Dark Mode.

### 16.1. Tailwind/React guidelines

- Use CSS variables as the source; Tailwind maps and composes tokens.
- Create semantic utilities such as `bg-canvas`, `bg-card`, `text-primary`, `rounded-card`; avoid screen-specific names such as `home-orange`.
- Do not arbitrarily mix `rounded-2xl` and `rounded-[29px]` within one component system.
- Components accept `variant`, `size`, `state`; screens supply data/layout, not internal styling.
- Tailwind v4 may map tokens through `@theme inline`; v3 uses `theme.extend`. **Do not tie the design specification to a particular version.**

**Component style example (plain CSS):**

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 52px;
  padding: 0 var(--space-6);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-brand-500);
  color: var(--color-ink);
  font: 800 16px/20px var(--font-sans);
  cursor: pointer;
  transition: background var(--duration-fast),
              transform var(--duration-fast);
}

.btn-primary:hover { background: var(--color-brand-600); }
.btn-primary:active { transform: scale(.98); }
.btn-primary:focus-visible {
  outline: 3px solid var(--text-primary);
  outline-offset: 3px;
}
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }

.app-screen {
  min-height: 100dvh;
  background: var(--bg-canvas);
  color: var(--text-primary);
  padding-inline: var(--page-gutter);
  padding-top: max(var(--space-4), env(safe-area-inset-top));
  padding-bottom: calc(var(--bottom-nav-height) + 24px + env(safe-area-inset-bottom));
}

.study-screen {
  max-width: var(--study-max-width);
  margin-inline: auto;
}
```

**Note:** Primitives such as `--color-ink` remain black in Dark for orange CTA text; semantic colors such as `--text-primary` change with the theme. Do not recolor every component by inverting `--color-ink`.

---

## 17. Naming Conventions and Design Asset Structure

### 17.1. Component names

```text
AppShell
AppHeader
FloatingBottomNav
DesktopSidebar
PrimaryButton / Button
IconButton
BaseCard
DeckCard
CategoryHeroCard
ReviewDueCard
StatCard
AchievementCard
SearchField
TextField
SegmentedControl
FilterChip
ProgressBar
Avatar
StatusBadge
BottomSheet
ConfirmDialog
EmptyState
ErrorState
Flashcard
ReviewRating
QuizQuestion
AnswerOption
AnswerFeedback
StudySummary
RankingPodium
RankingRow
VocabularyItem
SourceReference
AIReviewItem
VideoSubtitleOverlay
VocabularyPopover
```

Prefer one `Button` with variants over disconnected buttons. This list describes component roles, not a requirement for separate implementations of every name.

### 17.2. Design source organization

```text
design/
├── foundations/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing-and-layout.md
│   ├── motion.md
│   └── accessibility.md
├── components/
│   ├── buttons/
│   ├── cards/
│   ├── navigation/
│   ├── forms/
│   ├── feedback/
│   └── study/
├── patterns/
│   ├── explore/
│   ├── focus/
│   ├── creation/
│   └── extension/
└── assets/
    ├── icons/
    ├── illustrations/
    └── decorative-shapes/
```

### 17.3. Code organization (reference)

```text
src/
├── design-system/
│   ├── tokens.css
│   ├── components/
│   └── patterns/
├── features/
│   ├── onboarding/
│   ├── home/
│   ├── library/
│   ├── flashcards/
│   ├── quiz/
│   ├── spaced-repetition/
│   ├── ai-generation/
│   ├── vocabulary/
│   ├── ranking/
│   └── profile/
├── app/
└── i18n/
```

Do not organize reusable components solely by screen. `DeckCard` has one standard implementation across features.

---

## 18. New screen design workflow

Before designing or asking AI to generate a new screen, follow this workflow.

### Step 1 — Determine mode

`Explore` or `Focus`? This determines illustration density, colors and navigation.

### Step 2 — Choose a screen template

Choose `Explore`, `Study`, `Editor`, `Ranking`, `Data list`, `Settings`, `Overlay / Extension`, or propose a new template only when necessary.

### Step 3 — Select standard components

Reuse existing tokens/components. Create components for functional or behavioral differences, never copies just to change padding by 3px.

### Step 4 — Establish hierarchy

- One primary goal per screen.
- Clearly visible primary CTA.
- Secondary, smaller metadata after main content.
- Easy-to-find Back/Cancel.
- No decoration or floating navigation covering important content.

### Step 5 — Design states

At least initial, loading, empty, error, success and responsive; study UI also needs answer states and resume.

### Step 6 — Check accessibility

Contrast, keyboard, focus, screen reader, text zoom, reduced motion, touch target.

### Step 7 — Match visual DNA

Cream background? Orange primary? Bold rounded type? Correct radii? Restrained illustration? Clearly distinct modes? If not, fix before merging.

---

## 19. Standard AI UI Generator Prompt

Attach the complete `DESIGN.md` to a UI generation tool and use this request template:

```text
Design and implement [SCREEN_NAME] for a learning app with
Flashcards / Quiz / Spaced Repetition.

You MUST read and follow DESIGN.md as the single source of truth.
Do not independently change its palette, font, border radius, spacing scale,
button variants or navigation.

Screen mode: [Explore | Focus].
Platform: [Mobile | Desktop Web | Chrome Extension].
Primary user goal: [USER_GOAL].
Content sections (in order): [SECTIONS].
Primary CTA: [ACTION].
States: default, loading, empty, error, success, disabled;
add selected/correct/incorrect for learning interactions.

Prioritize reusable components, semantic CSS tokens,
responsive layout, WCAG AA, keyboard navigation and reduced motion.
Maintain playful, warm, bold, rounded, flat illustration styling;
do not directly copy reference characters.

Required output:
1. Component tree and data props.
2. Mobile and desktop UI, or extension UI if specified.
3. Interaction and empty/error states.
4. Explicit mapping to DESIGN.md tokens.
5. New component/token list only if additions are necessary.
```

**AI rule:** If a request conflicts with `DESIGN.md`, identify the conflict and propose a system update first; do not silently change an individual screen's design.

---

## 20. Design QA Checklist / Definition of Done

### Brand consistency

- [ ] Cream/white canvas, no arbitrary blue/purple/cold gray substitution.
- [ ] Consistent primary/action orange `#F8672B`.
- [ ] Bold Nunito headings; same body font family.
- [ ] Token-based card radii/button heights, no arbitrary magic numbers.
- [ ] Consistent illustration/motif direction, no copied existing characters.
- [ ] Motifs do not touch text/actions or overwhelm Focus Mode.

### UX and functionality

- [ ] One clear primary action.
- [ ] Long content/names and many choices never overflow the screen.
- [ ] Navigation/sidebar respects safe areas and does not cover content.
- [ ] Appropriate hover/pressed/focus/disabled/loading for each interaction.
- [ ] Designed loading, empty, error, retry/resume states.
- [ ] Clear quiz feedback; SRS reflects actual schedules.
- [ ] AI content has review and appropriate provenance.
- [ ] Extension UI does not obstruct video controls or promise unsupported features.

### Accessibility

- [ ] Measured text/icon/control contrast in important states.
- [ ] Touch targets ≥44px according to the internal standard.
- [ ] Logical keyboard navigation and focus order.
- [ ] Text zoom preserves layout.
- [ ] `prefers-reduced-motion` behavior.
- [ ] Correct/incorrect signals beyond color.
- [ ] Accessible icon-button labels and informative illustration descriptions.

### Engineering

- [ ] Shared components and semantic tokens.
- [ ] No hardcoded palette/radius/spacing except documented exceptions.
- [ ] Responsive from 320px to desktop; test at least 320, 375, 390, 430, 768, 1024, 1440px.
- [ ] No unintended horizontal overflow.
- [ ] Verified i18n and Vietnamese diacritics.
- [ ] Complete palette and separate QA for enabled Dark Mode.
- [ ] Visual regression/Storybook or equivalent tests for important base components.

---

## 21. Fixed and Extensible Design Decisions

### Fixed for v1.0

- **Visual direction:** Playful Learning / Neo-brutalism Lite.
- **Primary color:** `#F8672B`.
- **Base background:** `#F7F6F0`.
- **Primary ink:** `#111111`.
- **Typography:** Nunito.
- **Shape:** rounded cards 28px, pill actions/nav.
- **Layout:** mobile-first, two visual density modes.
- **Interaction:** clear states and reduced motion.
- **Accessibility:** WCAG 2.2 AA target.
- **UI architecture:** component-driven + design tokens.

### Open to controlled experimentation

- Original logo, brand name and mascot.
- Illustrations for different study topics.
- Gamification economy: XP, coin, badge mechanics.
- Exact bottom navigation destinations after usability testing.
- SRS algorithm and corresponding rating labels.
- Dark Mode launch timeline.
- Unimplemented game modes.

Keep the palette and component system stable as the product expands. Foundation changes require a `DESIGN.md` version increase and changelog entry.

---

## 22. Changelog

| Version | Changes |
|---|---|
| `1.0.0` | Initial reference-based design system: color, typography, spacing, layout, components, motion, screens, accessibility, responsive behavior, extension and QA workflow. |

---

**Final principle:** *Make the design playful enough to invite starting, clear enough for focused learning, and consistent enough that every new screen belongs to the same product.*
