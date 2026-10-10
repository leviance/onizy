# Feature specification for a knowledge learning and review app

Reference product research and proposed development scope

Version 1.0 • Research date: October 8, 2026

For founders, product managers, designers and engineers. Scope includes a multi-subject learning app, a Chrome extension for subtitle translation and knowledge capture, AI material generation, external imports and spaced repetition.

**Proposed direction:** turn knowledge encountered in videos, documents and AI conversations into material that can be tested and reviewed. The core experience is **capture with context → review materials → practice recall and application → review on time → assess retention after a delay**.

The original MVP proposal is a responsive web app and Chrome extension for YouTube with compatible subtitles, starting with Vietnamese and English. The app must work independently without the extension. Udemy, Coursera, native mobile, public communities and classes have separate validation gates.

## 1 Scope and reading guide

### Basis for the proposals

This research compares official help and product pages for 11 products: Quizlet, Anki, RemNote, Brainscape, Knowt, Wayground, Memrise, DuoCards, Language Reactor, Migaku and eJOY. Numbered sources appear at the end and alongside relevant claims. This is a survey of public functionality, not a market-share ranking or paid-account test report.

Features, plan limits, regions and platforms may change. “Proposed” specification items are decisions for the new product, not descriptions of competitors' existing capabilities. Acceptance thresholds and target metrics are initial hypotheses to validate, not measured results.

### Priority notation

| Level | Meaning | Planning condition |
| --- | --- | --- |
| P0 | Required for the complete MVP | Close the capture/create/study/review loop; delivery may span internal milestones |
| P1 | After the MVP stabilizes | Expand sources/formats or improve a measured bottleneck |
| P2 | Demand-driven expansion | Invest only after validating the segment and operational capacity |

Codes such as EXT03 and SRS02 trace requirements to design and tests. P0 does not mean every feature must appear in the first trial release.

### Working assumptions

- Initial segment: adults independently learning languages, professional knowledge and online courses; schools are not the first market.
- One account across web and extension. Phone browsers can support review; do not assume extensions run in mobile Chrome.
- Personal content is private by default. Learners own their learning records and can export materials in open formats.
- Brand name, pricing, team and launch date were not fixed in the research proposal. The roadmap is organized around outcomes.

## 2 Reference product research

### Lessons from Quizlet

**Deck creation and management.** Quizlet supports creating sets and importing existing terms/definitions. Exports apply to user-created sets. Import/export scope must be explicit while reducing initial data entry. [S01, S02]

**Learn and Test address different needs.** Learn builds practice around goals and familiarity, with question types, order, audio and card scope options. Test generates assessments from sets. Separate immediate-feedback practice from assessments graded at the end. [S03, S04]

**AI Practice Tests.** Distinct from Test: generate assessments from notes or sets, choose question count/types and time limits. Help documents specify language, age and country eligibility; do not assume every AI feature is available in Vietnam. [S05]

**Spaced repetition is already a separate feature.** At the research date, Quizlet describes Spaced repetition within Flashcards, with four self-ratings, daily new-card counts and schedules; documentation lists web availability. Merely having SRS is not sufficient differentiation. [S06]

**AI extends beyond card generation.** Ask Quizlet explains, finds material and creates cards from questions, files or images; help currently limits it to US users aged 14+. Audio Notes converts recordings to Study Guides and sets with separate language limits. Quizlet also offers a ChatGPT-to-set flow. The new app needs quality control and interoperability because AI flashcard generation is already common. [S07, S08, S09]

**Proposed application:** simple organization and quick starts from a set; separate practice, assessment and review schedules. Support professional questions, explanations and sources rather than only term/definition pairs.

### Comparison of 11 products

“Lesson” is a design interpretation of published functionality. The final column describes choices for the new product, not claims that competitors lack features.

| Product | Verified reference features | Lesson | Proposed application |
| --- | --- | --- | --- |
| Quizlet | Sets, Learn, Test, AI Practice Tests, SRS, Ask Quizlet [S01–S09] | Reuse material across modes | Distinct mode goals and simple starts |
| Anki | FSRS SRS, new-card limits, review history, import/export [S10–S12] | Per-user, per-card schedules | Canonical history, open data, no algorithm tuning required for beginners |
| RemNote | Note-linked cards; AI cards from selected content, settings, preview [S13, S14] | Create cards while reading/taking notes | Source links and approval before learning |
| Brainscape | Learner confidence ratings drive repetition [S15] | Clear self-ratings | Explain forgetting versus difficult recall; track confidence/result discrepancies |
| Knowt | Imports, AI cards, Learn, SRS, practice [S16] | Reduce switching barriers | Treat external AI imports as an official flow |
| Wayground | Diverse question types, live/home assignments, reports [S17, S18] | Structured, diverse question banks | Good multiple-choice first; classes/advanced questions later |
| Memrise | Native-speaker videos, vocabulary practice, AI conversations [S19] | Connect vocabulary to usage | Source sentences, listening, application; word translation is not complete knowledge |
| DuoCards | Save while reading/watching, extension, spaced repetition [S20, S21] | Low-friction capture and review sync | Quick saving, material inbox, clear sync states |
| Language Reactor | YouTube/Netflix tools, lookup, saved words/sentences, Anki export [S22, S23] | Learning-oriented subtitle controls | Sentence repetition, shortcuts, context capture, exports |
| Migaku | Subtitle lookup, cards with sentences/images/audio, review integration [S24, S25] | Video material needs provenance | Timestamps/source sentences first; media by rights and costs |
| eJOY | Dual subtitles, saved words, video integrations, SRS vocabulary [S26, S27] | Direct competitor for the extension idea | Multi-subject knowledge and question quality beyond vocabulary |

### Proposed product opportunities

**One library for vocabulary and knowledge.** In an English lecture, a learner may save “gradient” as a word or its explanation as a mathematical concept. These are related but have different review goals.

**Sources are part of learning material.** Retain the original sentence, document/video name, excerpt and position. After a mistake, learners return to the relevant explanation without searching the entire course again.

**Open data and external AI support.** Import templates let users ask ChatGPT, Claude, Gemini or another tool to generate content. The app validates structure and offers review; integrated AI purchases are not required to study personal material.

**Measure recall and application.** Completed questions, study time and streaks measure activity. Also observe first recall after a delay and novel questions testing the same concept.

These positioning hypotheses require user trials; they do not assert that no competitor has implemented them.

## 3 Users and jobs to be done

| Group | Situation | Outcome | Priority |
| --- | --- | --- | --- |
| Language learner | Encounters words/phrases in video | Save contextual meaning, listen, review | P0 |
| Professional learner | Takes technical, economics or history courses | Turn main ideas into recall/understanding questions | P0 |
| Exam candidate | Has a syllabus and exam date | Topic practice, gap detection, time management | P1 |
| Material author | Writes questions or generates them with AI | Import, edit, validate, reuse | P0 |
| Teacher/study group | Shares materials and assignments | Version management and authorized progress visibility | P2 |

### Video-to-review journey

1. Open a supported video and enable subtitle tools.
2. Select a word, phrase or knowledge excerpt; inspect its contextual meaning/explanation.
3. Quick-save the source sentence, language, source and time. The extension confirms local saving or synchronization.
4. The item appears in the material inbox. Choose meaning, edit translation, select a deck and practice type.
5. Approve suggested cards/questions; only accepted content enters the study queue.
6. Complete a short session with feedback and a subsequent review schedule.
7. After an incorrect review, reopen the source or flag material for editing; viewing the source never automatically becomes a correct response.

### Learning knowledge from documents

Paste notes/lecture excerpts, choose “professional knowledge”, and specify recall, understanding or application goals. AI suggests concepts, questions and source evidence. Approve some or all, then practice by topic. Incorrect answers go to the mistake log; related review cards are suggested for confirmation.

### Importing externally generated AI material

Take a JSON/TSV template to an external AI tool and paste the result into the app. Separate structural from content errors, show previews and error positions. After corrections, import as an undoable batch. No external AI API is required.

### Authoring and practicing assessments

Create a deck, add personal cards/questions and explanations. Choose guided practice to learn or an assessment to evaluate. Results are associated with question versions; retries never overwrite earlier history.

## 4 Content structure and learning principles

### Distinct concepts

| Concept | Meaning | Example |
| --- | --- | --- |
| Source | User-provided video, notes, file or passage | Lecture on gradient descent |
| Source segment | Specific referenceable portion | Subtitle at 12 minutes 34 seconds |
| Knowledge item | Idea or word sense to learn | Role of learning rate |
| Flashcard | Recall prompt and answer | What does learning rate control? |
| Question | Structured prompt, answer, choices, explanation | Consequence of excessive learning rate |
| Deck | Topic collection of cards/questions | Optimization basics |
| Review schedule | Per-user state for a review unit | Due time, lapses, estimated stability |

One knowledge item may have several cards/questions. Word recognition, written recall and listening cards do not share a recall state as though they tested the same skill. Decks can share content; schedules always belong to individual learners.

### Lesson design principles

Retrieval practice research shows recall attempts can improve long-term retention relative to rereading under studied conditions. Spacing research shows appropriate intervals also depend on the desired retention period. These support review and delayed assessment design; they do not prove this particular app improves learning outcomes. [S28, S29]

- Prefer one clearly answerable, self-ratable idea per card.
- Present the question before answers or source passages that reveal them.
- Separate recognition, unaided recall, understanding and application.
- Ensure understanding before scheduling difficult concepts.
- Connect feedback to specific mistakes, not only scores.
- Limit new cards according to review capacity; generated card count is not the main goal.

## 5 Accounts and material library

### ACC01 Accounts and sign-in sessions

**P0.** Registration, sign-in/out, recovery, device-session management. Select one primary MVP sign-in method; add Google/passkeys as needed. The extension connects through its own authentication flow, never requesting YouTube/Udemy/Coursera passwords. Switching accounts separates the previous account's pending sync data.

**Acceptance:** user A's data never appears for user B; revoking a session makes the extension reconnect without silently losing locally saved items.

### ACC02 Learning profile and onboarding

**P0.** Choose interface/study languages, timezone and expected review duration. Choose languages, professional knowledge or both. No long mandatory questionnaire before the first session. Provide a small sample deck and Skip.

### LIB01 Decks and folders

**P0.** Create, rename, describe, tag, archive and recoverably delete. Decks contain cards/questions and support studying all content or individual types. Each has an owner, language and privacy state. P1 adds nested folders and smart filters.

### LIB02 Material inbox

**P0.** Consolidate extension captures, file imports and AI results. Content states: draft, needs checking, approved, archived; show sync separately. Support bulk editing, target deck selection and rejection. Quick-saving does not immediately schedule review.

**Acceptance:** approve 5 of 10 AI items; only those five enter learning. Others remain drafts.

### LIB03 Search and filters

**P0.** Search titles, card content, vocabulary, tags, sources; filter by type, deck, language, approval and review states. Optional accent-insensitive Vietnamese search must preserve original content. P1 adds semantic search while retaining exact search.

### LIB04 Versions and recovery

**P0.** Draft autosave, significant change history, trash, import-batch undo. Spelling/tag edits preserve schedules. Answer/meaning changes explain impact and offer retaining history or resetting the affected schedule. Old assessments preserve question snapshots.

### LIB05 Sources and occurrences

**P0.** Items may link multiple source segments. Retain URLs stripped of unnecessary sensitive parameters, source names/platforms, capture time and position. One word in two videos may share a meaning with different examples; different senses may be separate items.

**Acceptance:** merging preserves examples/sources; private sources are not automatically exported with shared decks.

## 6 Card authoring and question banks

### EDT01 Material editor

**P0.** Direct add/edit, duplicate, preview, tags, sources, explanations, knowledge-item links. Support multiline text, basic formatting and nonexecuted monospaced code. Strip scripts/dangerous HTML from pasted content. P1 adds images, audio, correctly rendered mathematics and bulk editing.

### EDT02 Flashcard types

| Type | Required content | Rule | Level |
| --- | --- | --- | --- |
| Two-sided | Prompt, answer, optional explanation | Reveal only on learner request | P0 |
| Reverse | Content pair, two prompt directions | Sibling cards, separate schedules; no meaningless automatic reversals | P1 |
| Cloze | Sentence, hidden span, answer, accepted variants | No empty spans; group multiple spans appropriately | P1 |
| Word in context | Word/phrase, meaning, source sentence | Preserve selected sense and both languages | P0 |
| Listen and answer | Audio, answer content | Label TTS/source audio; allow replay | P1 |
| Image occlusion | Image, recall regions | Labels, answers, accessible descriptions per region | P2 |

### EDT03 Question types

| Type | Grading | Content requirement | Level |
| --- | --- | --- | --- |
| Single correct answer | Compare selected choice ID | 2–6 distinct choices, exactly one correct | P0 |
| Multiple correct answers | Extended MVP: exact ID-set match | At least one correct; clearly request multiple selections | P1 |
| True/false | Compare selection | Mandatory explanations for AI generation | P1 |
| Short answer | Compare answer/variants | Per-question accent, case, unit, rounding rules | P1 |
| Matching/ordering | Compare relations/order | Stable choice IDs; avoid ambiguous pairs | P2 |
| Explanation/application | Rubric, self-check or AI support | Explicit criteria; allow grading disputes | P2 |

### EDT04 Multiple-choice quality

**P0.** Clear prompts, determinate answers, explanations. Distractors share semantic categories and remain plausible without becoming correct. Avoid A/B/C/D positional dependence or “both A and B” when shuffled. Use stable choice IDs.

Automated validation blocks empty answers, nonexistent IDs, exact duplicate choices and multiple correct answers in single-choice items. Ambiguity, double negatives and factual errors are flagged for review; structural validation must not be labeled “verified correct”.

### EDT05 Conversion and links

**P0.** Create cards from mistakes and questions from cards. Additional AI content remains editable draft. Related material links to one knowledge item without copying scores/schedules. P1 adds question variants for the same goal to reduce memorization of question forms.

### EDT06 Publication controls

**P0.** Drafts never enter review queues. Self-authored content may be saved/approved through one explicit action. AI/imported items show provenance, user approval and source links where available. Distinguish user approval from expert verification.

## 7 Study and assessment modes

### STU01 Free card browsing

**P0.** Flip, reorder, select scope, flag edits, view sources. Reading/preview mode never updates SRS merely from flipping cards. Provide an action to start a recorded review session.

### STU02 Scheduled review

**P0.** One “Review today” entry, due/new eligible cards and estimated duration. Each review has a prompt, answer reveal, four recall ratings and expected due time. Pause/resume preserves recorded reviews.

### STU03 Multiple-choice practice

**P0.** Choose decks/topics, count, incorrect/unseen questions. Answers reveal correctness, explanation and source; allow guessed, faulty-question and needs-review flags. Correcting after feedback does not automatically earn correctness. P1 adds easy-to-hard sequencing and intentional topic interleaving.

### STU04 Assessments

**P0.** Choose count, optional time limit and scope. Support review flags, progress, temporary saves, submission. Reveal answers only after submission; apply announced time-expiry rules. No hints or AI tutor during assessments.

**Acceptance:** reload restores the same assessment, order and remaining time; track unanswered questions separately; duplicate submissions do not create duplicate results. MVP provides self-assessment, not proctoring or certificate-level cheating prevention.

### STU05 Mistake log

**P0.** Collect incorrect answers, correct guesses, repeated errors and reported questions. Optional categories: forgetting, misunderstanding, misreading, missing prerequisites. Open explanations/sources, edit material or create cards requiring approval. One mistake never implies poor mastery of an entire topic.

### STU06 Goal-based modes

**P1.** Plan around an exam/personal goal with daily duration and scope. Combine due reviews, unseen material and assessments. Cramming is a separate labeled queue, never overwriting long-term memory schedules automatically. P2 adds group sessions and review games.

## 8 Spaced repetition and progress modeling

### SRS01 Scheduler choice

**P0.** Prefer an FSRS library evaluated for license, quality and maintainability over invented fixed day intervals. Anki publishes FSRS, parameters, desired retention and workload tools. This is a reference, not a requirement to copy every Anki setting. [S10]

New users start with chosen-version defaults. Proposed initial retention is 0.90, presented as a prediction target, not a 90% guarantee. Enable personal optimization only with enough data under library conditions and validate on history withheld from optimization.

### SRS02 Recording a review

**P0.** Store learner, card, content version, occurrence/receipt times, result, answer reveal, duration, device and scheduler version. Ratings: “Again”, “Hard”, “Good”, “Easy”. Hard is correct recall; forgetting requires Again. [S10, S11]

Events have deduplication IDs. Allow undo of the latest review, retain undo traces and recompute from valid history. Never silently edit past events.

### SRS03 Separate evidence types

**P0.** MVP FSRS receives ratings from unaided flashcard recall. Multiple-choice results stay in question history/mistake logs; one correct choice does not become a card's Good rating. Updating a card schedule requires a review in that card's format.

P1 experiments scheduling quizzes need separate review units/parameters and calibration data. Record hints, revealed answers and guesses; do not equate them with unaided recall evidence.

### SRS04 Queues and review workload

**P0.** Prioritize due content; configurable new-card limits and timed sessions. With overdue backlogs, suggest reducing/pausing new cards. Session limits must not hide remaining due counts.

Study days use account timezone and a defined day boundary. Timezone changes never duplicate events/streaks. Overdue cards use actual history, never reset whole decks automatically.

### SRS05 Related and repeatedly difficult cards

**P1.** Avoid adjacent cards revealing the same answer; postpone siblings to a later session/day. Detect repeated failures and suggest editing, splitting, examples or suspension rather than simply repeating unclear cards more often.

### SRS06 Consistent, explainable schedules

**P0.** Identical event streams and algorithm versions produce identical canonical state. Web is the original MVP's main review platform; extension captures only. Scheduler changes require versions, impact previews and recovery. Explain simply, such as “recently forgotten” or “recalled repeatedly”, without requiring learners to read formulas.

P1 adds offline review. Concurrent device reviews preserve both events, flag conflicts and never silently treat simultaneous reviews as independent, adequately spaced evidence.

## 9 Chrome extension for subtitle translation and knowledge capture

### Platform support scope

Publish support by platform and content type, never “all videos”. YouTube's official API separates track listing from downloading track content; downloads require video editing permission. It cannot be assumed to provide public subtitles for every watched video. [S30, S31]

Udemy subtitles/languages vary by course. Coursera documents downloading transcripts/subtitles where available. Subtitle availability does not itself imply a supported integration API. [S32, S33]

| Source | Proposed scope | Unsupported-content fallback | Release gate |
| --- | --- | --- | --- |
| YouTube | P0 for tracks accessible in the user session through tested adapters | Save URL/notes; import text or authorized subtitle files | Test manual/automatic subtitles, language changes, ads, video changes |
| Udemy | P1 for confirmed players/courses | Paste transcripts or import permitted downloads | Test authenticated sessions, multi-chapter courses, lesson changes |
| Coursera | P1 for confirmed players/lesson types | User-provided transcripts/subtitles | Test languages, lesson navigation, source positions |
| Other websites | P1 text selection; P2 dedicated video integrations | Save selection/URL without promising subtitles | Dedicated adapters and support notices |
| Videos without subtitles | P2 authorized speech recognition | Explain absence; continue saving notes | Verify processing rights, costs and quality per language |

### EXT01 Page detection and support states

**P0.** Show platform, current video, subtitle track/language and operational state. Distinguish subtitles off, no track, no permission, adapter error and unsupported. Video changes without reload cancel old work and identify the new video.

**Acceptance:** changing A to B never displays A's translation or saves A's timestamp to B; integration failure never breaks the original player.

### EXT02 Bilingual subtitles

**P0.** Show original/translation, toggle individual lines, adjust size, position and contrast. Keep originals accessible. Select source/target languages; autodetection is an editable suggestion.

Combine subtitle fragments into contextual translation units, then map to original intervals. Segment timestamps must not imply word-level accuracy. Support track changes, seeking, playback speed and fullscreen within tested scope; disclose unsupported Picture in Picture overlays.

**Acceptance:** old translations never overwrite new tracks/seek positions. Originals stay synchronized while translation is pending.

### EXT03 Contextual word and phrase lookup

**P0.** Tap/select subtitle text for meaning, part of speech and sentence translation; expand to phrases. Distinguish dictionary meanings from AI explanations. Allow editing before/after saving. Whole-video translation is not required for one-word lookup.

P1 adds pronunciation, IPA, lemmas, inflections, collocations and sentence analysis. English tokenization cannot be applied unchanged to Chinese, Japanese or Vietnamese; each language requires its own segmentation and tests.

### EXT04 Quick and detailed saving

**P0.** Quick save creates a draft for the current account and last target deck with immediate feedback. Detailed save edits word, meaning, sentence, tags, notes, target deck. Configurable shortcuts do not run while typing into page fields.

Minimum data: selection, original sentence, translation if available, languages, platform, URL, video ID if available, interval, save time. Missing fields stay visibly empty, never fabricated. Each operation has a deduplication key.

### EXT05 Capture professional knowledge

**P0.** Alongside saving words, offer “Save this idea” for selected sentences. Learners supply titles or request AI suggestions later; allow notes about unresolved questions. Send knowledge items to the inbox without forcing word/meaning structure.

**Acceptance:** an overfitting explanation can become an explanatory card or application question; sources reopen at original positions. AI additions beyond the passage are distinguished under AI02.

### EXT06 Video learning controls

**P1.** Repeat current segment, move by sentence, pause at sentence ends, hide translations until hover, show transcript alongside video and search accessible transcript text. Autopause has quick disable. No TTS over video audio without user selection.

### EXT07 Queued synchronization

**P0.** States: saved locally, syncing, synced, sign-in required, send failed. Durable queue, backoff retry, deduplication. Local-save confirmation must be visually distinct from server confirmation.

MVP permits offline text capture with an existing session, not necessarily new offline translation. Tab closure/service-worker shutdown preserves queues. Uninstalling may lose unsynced local data; explain this in unsynced-item management.

### EXT08 Permissions and capture boundaries

**P0.** Request only enabled platform/feature permissions, with per-site toggles. Explain what is sent for translation/AI. Do not collect unrelated pages, full browsing history or login cookies. Disabling stops observation and new content transmission.

Chrome recommends considering optional permissions. Manifest V3 requires packaged executable logic rather than arbitrary remote code. Distinguish translation API calls/remote data from loading executable code. [S34, S35]

### EXT09 Translation quality and costs

**P0.** Translate current segments and a small buffer with limits and cancellation. Cache by content, language, model version and glossary; never share private-source caches across accounts. Exhausted limits still allow original subtitles and captures.

**P1.** Subject glossaries keep terms such as token, attention and margin consistent; allow original terms alongside meanings. Personal translation edits never modify platform subtitles.

### EXT10 Return to source and optional media

**P0.** Source actions seek the correct video/timestamp where supported. If exact seeking fails, show title/time for manual navigation. Deleted/inaccessible sources do not delete saved cards.

**P1 or P2.** Attach source images/audio only when access mechanisms and usage rights permit. Never default to downloading entire courses or bypassing access controls/DRM. MVP can use text/links; label generated TTS separately from source audio.

## 10 AI material generation

### AI01 Inputs and generation settings

**P0.** Pasted text, personal notes, extension captures or topic descriptions. Choose target deck, language, count, material type, recall/understanding/application goal. Apply size limits and explain insufficient sources for requested counts.

**P1.** Text PDFs, DOCX, PPTX, OCR images, SRT/VTT. **P2.** Long audio and unsubtitled video transcription. Receiving a URL does not mean obtaining content; confirm what was read before generation.

### AI02 Two clearly scoped generation modes

**P0.** “Source-based” generates only source-supported knowledge; “Topic-based” uses model knowledge without source guarantees. Label mode in previews. Insufficient sources may yield fewer items with missing coverage explained.

Generate additions beyond sources only through explicit opt-in, and label them. Never invent timestamps/citations for generated questions. Model confidence is not a calibrated correctness probability.

### AI03 Generation and validation pipeline

**P0.** Read input, segment with IDs, identify ideas/objectives, generate structured material, validate, draft. Structural validation runs independently of the model. Flag duplicates, ambiguity, weak distractors and unsupported answers.

Checks reduce errors but cannot replace content review. Do not inflate counts by restating one idea repeatedly. Inputs are untrusted data; instructions in PDFs/subtitles cannot change tasks, invoke tools or access other data.

### AI04 Evidence and preview

**P0.** Source-generated items have `source_ref` pointing to supplied segments and positions where available. Show prompt, answer, explanation and source together; edit, discard, keep, regenerate individually. Bulk approval follows content preview.

**Acceptance:** reject nonexistent segment IDs. Segment existence is reference validation only; whether it supports an answer requires separate evaluation.

### AI05 Distractors and explanations

**P0.** Base distractors on relevant misconceptions, not grammatical clues. Explain why the correct answer is correct; P1 explains each distractor. Application questions state assumptions and sufficient data; never add unsourced numbers as if factual.

### AI06 Background jobs and budgets

**P0.** Queued, processing, partial, complete, failed, canceled states. Leave/return support, predicted limits before generation, one valid job per deduplicated request. Provider retries never duplicate materials or charges.

Incomplete jobs show produced counts and reasons. Publish failure quota refunds. Do not switch to expensive models/new providers outside approved data choices automatically.

### AI07 Material-based tutor

**P1.** Explain answers, ask guiding questions, offer examples/concept comparisons grounded in open material. Saving explanations as cards still creates drafts. Stepwise hints mark assisted attempts in practice. Disable tutoring during assessments until submission.

### AI08 Pre-release quality evaluation

**P0.** Validation corpus: Vietnamese/English, polysemy, noisy transcripts, technical notes, insufficient sources. Human ratings: correctness, grounding, clarity, unique answer, duplication. Separate structural validity from content correctness.

Associate prompt/model/validator versions with batches for investigation. Repeated severe errors may suspend generation for a content type while existing study/review remains available.

## 11 Material import and export

### IMP01 Formats and support scope

| Format | Use | Proposed scope |
| --- | --- | --- |
| TSV / two-column text | Quick spreadsheet/AI cards | P0 front/back, optional tags/source mapping |
| UTF8 CSV | Cards/MCQ templates | P0 column mapping and preview |
| Versioned JSON | Rich AI/tool data | P0 preserve file-internal IDs and source links |
| Markdown table paste | Copied conversations | P1 preview and parsing confirmation |
| SRT/VTT | Timestamped subtitle sources | P1, not automatically one card per line |
| Anki APKG | Templates/media transfer | P2 published subset; no promise of all add-ons/templates |

User-exported Quizlet CSV/TSV is the basic transfer flow. No guarantee of importing every Quizlet link or private content. Anki's text/deck-package support illustrates the difference between simple card data and structured media packages. [S02, S12]

### IMP02 Preview-based import

**P0.** File/paste, detect format, map fields, preview samples, per-row validation, duplicate policy, confirmation, report. Valid-only imports require explicit selection; never silently skip errors.

Errors point to rows/JSON paths and correction values. Never replace missing answers with AI silently. Offer error downloads and retries for failed items only.

### IMP03 Deduplication and safe updates

**P0.** External IDs are scoped by account/import source. Duplicate IDs offer skip, copy or update after diff preview. Content similarity suggests duplicates, never automatically merges word senses or different question objectives. Reimporting a batch does not create unintended copies.

### IMP04 Export and backup

**P0.** Deck CSV/JSON exports with optional explanations/tags/sources. Separate full personal JSON backup includes review history/schema version; CSV cannot preserve every structure. Shared files exclude personal history by default.

**P1.** Restore with preview/conflict policy. Incompatible external review history is not automatically adopted; schedules default to new unless a validated converter exists. Original data exports remain available after paid plans expire.

### IMP05 External AI templates

**P0.** “Copy generation instructions”, JSON/table templates. Specify question types, count, language, sources, answer declarations and no fabricated sources. Accept raw output; parsing may remove one code fence but never infer ambiguous structure silently.

## 12 Progress and habit formation

### ANA01 Today's learning

**P0.** Due/overdue cards, drafts awaiting approval, daily goals, start action. Empty states offer create/import/video capture. Completion distinguishes reaching session limits from clearing all due cards.

### ANA02 Personal statistics

**P0.** Separate attempts, unique studied items, quiz accuracy and rated card recall. Show period, denominators and data counts. P1 adds concept progress, 7-/30-day delayed assessments and upcoming workload estimates.

Never show “100% mastered” from viewing all cards. Appropriate states: unseen, learning, needs reinforcement, repeatedly recalled; explain their basis. Model recall probabilities are labeled estimates.

### ANA03 Reminders and goals

**P0.** One optional reminder channel, local time, pause, quiet hours. Remind only when review work exists; prevent account-level duplicates. P1 adds flexible plans, estimated minutes and workload warnings.

### ANA04 Motivation and games

**P1.** Streaks, weekly goals, progress feedback based on meaningful sessions; easy breaks/returns. **P2.** Matching, group competitions and purposeful learning badges. Game points never update recall automatically; rankings are optional and private by default.

## 13 Sharing and collaboration

### COL01 Private permissioned sharing

**P1.** Separate view, study, copy, edit permissions. Revocable read-only links. Recipients have separate schedules. Deck access never automatically grants private PDFs/transcripts/owner notes.

### COL02 Copies and followed decks

**P1.** Distinguish independent copies from following originals. Authors cannot change independent copies; followers receive version notices/diff previews before applying. Learners control schedules when answers change.

### COL03 Classes and groups

**P2.** Classes, invitations, deck/test assignments, deadlines, authorized reports with disclosed access. Teachers do not automatically see private libraries, AI conversations or browsing history. Roles: class owner, author, learner.

### COL04 Public repository

**P2.** Search, categories, quality ratings, error/violation reports. Review sources, reuse rights and personal information before publishing. Moderation, spam prevention, copyright management, versions required. Exclude from MVP to avoid premature community operating costs.

## 14 Operations and service plans

### OPS01 Content administration and support

**P0.** Least-privilege access to AI jobs, sync failures and material reports. Support views personal content only with appropriate basis/permission; audit sensitive access. Suspend faulty models/adapters.

### OPS02 Integration observability and quality

**P0.** Errors by platform, extension version, operation and track type; no full transcripts in logs by default. Test-video fixtures, player-change regressions, capture-success dashboard. Disable broken integrations independently while review remains available.

### OPS03 Quotas and entitlements

**P0.** Server-side AI/translation quota tracking. Free users retain manual creation/import/study/export under published policies. Exhaustion explains restrictions and offers existing-material study. Trial abuse prevention is independent of payments.

### OPS04 Payments

**P1 when charging begins.** Plans, billing periods, renewal/cancellation, history, provider receipts and deduplicated webhooks. Expiry never deletes materials/history. Charge for variable-cost capabilities such as AI, high-volume translation, media, collaboration; exact prices require real costs/demand trials.

## 15 Screens and interface states

| Screen | Main content/actions | Special states |
| --- | --- | --- |
| Getting started | Goals, languages, sample decks | Skip, no account |
| Today | Due items, drafts, start review | Empty, backlog, session limit reached |
| Library | Decks, tags, search, filters | No results, archived decks |
| Deck detail | Cards, questions, sources, statistics | Empty, drafts, changed content |
| Inbox | Extension/import/AI captures | Duplicates, missing meanings, unreadable sources |
| Editor | Content, answers, explanations, preview | Unsaved draft, consequential answer changes |
| AI generation | Sources, goals, limits, jobs | Processing, partial, exhausted quota |
| AI review | Materials alongside sources | Unsupported claims, edit/regenerate individual items |
| Import | Formats, mapping, preview | Row/schema errors, duplicate IDs |
| Review session | Prompt, flip, rate, next schedule | Paused, offline, unrecorded events |
| Practice/assessment | Questions, choices, progress | Expired timer, failed submission, incomplete questions |
| Results/mistake log | Scores, explanations, reinforcement | Invalidated questions, insufficient data |
| Progress | Activity/results by period | Small samples, imported history, edited cards |
| Sources | Excerpts, positions, related items | Deleted video, lost access, unsupported seeking |
| Settings | Accounts, plans, privacy, export | Revoked devices, deletion in progress |
| Extension | Subtitles, lookup, save, queue | Unsupported, signed out, translation errors |

On phones, prioritize quick review starts and small edits; bulk editing may favor desktop. Every data-loading screen needs loading, empty, retryable-error and success states. Notices never rely solely on green/red.

## 16 Quality requirements and data protection

### Performance and reliability

These are initial test targets. Record environment, dataset size and network conditions before committing to operational guarantees.

| Area | Proposed MVP target | Evaluation |
| --- | --- | --- |
| Extension save | Local-save feedback p95 below 300 ms | From save tap to durable write on test devices |
| Small-item sync | p95 below 5 seconds with normal service/network | Exclude AI translation; measure server confirmation |
| Material search | p95 below 1 second for 10,000 account items | Vietnamese and long-sentence dataset |
| Start review | p95 below 2 seconds after app readiness | 500 due cards within 10,000 items |
| Imports | Proposed maximum 500 items per MVP batch | Preview, per-row errors, undo |
| AI generation | Proposed maximum 30 items per MVP job | Completion rate, duration, cost; no immediate-response promise |
| Data preservation | No loss of confirmed saves in tab-close/restart cases | Interruptions at sync stages |
| Extension compatibility | Chrome stable and previous version within published scope | Navigation, fullscreen, multiple extensions on one page |

Workloads/limits are configurable; explain excessive inputs before processing. Long jobs have server-side progress/states. AI/translation outages do not block existing-deck review.

### Privacy and source content

- Content, sources, answers and schedules are private by default; authorize every object server-side.
- Send only necessary excerpts to AI/translation providers. State actual providers/retention; never promise no training without corresponding configuration/terms.
- Account deletion covers sources, materials, progress, AI jobs and related data according to published retention; explain backups and legally retained payment data.
- Operational logs avoid full learning content. Analytics use appropriate IDs and explicit retention periods.
- Sharing is explicit; never automatically share full transcripts, course recordings or original documents with decks.
- Expansion to children/schools requires market-specific review of age, consent, school/provider rights. This is an expansion gate, outside the adult MVP.

### Data security and operations

Keep API secrets server-side, protect sessions, encrypt transit/storage according to infrastructure capabilities, rate-limit and restrict administration. Imports require MIME/size/embedded-content/decompression checks; sanitize HTML/Markdown before rendering. Future Anki templates cannot execute arbitrary scripts.

Control network access for user URLs to prevent internal-service requests. Media links cannot trigger unlimited downloads. Rehearse backup restoration. Imports, AI jobs, reviews and payments require deduplication.

### Accessibility and multilingual support

**P0.** Core study works with keyboards and screen readers; visible focus, scalable text, redundant answer-state signals, reduced motion. Disable unnecessary timed actions in practice.

Vietnamese/English interfaces are consistent; content fields may have independent languages. Do not strip Vietnamese diacritics for grading by default. P1 adds languages after appropriate segmentation, pronunciation, translation, generation and grading tests.

## 17 Product-level data model

Conceptual separation of responsibilities; each row need not become an independent database table.

| Entity | Important fields/relations | Rule |
| --- | --- | --- |
| User / Preferences | Languages, timezone, goals, devices | Preferences separate from content |
| Deck / Membership | Owner, permissions, tags, version | Personal schedules outside shared decks |
| Source | Type, name, URL, access, language | Sources may be more private than decks |
| SourceSegment | Text, time/page position, parent source | References target existing segments |
| Capture | Selection, example, sync state | Captures are not approved cards |
| KnowledgeItem | Idea/word sense, objective | Polysemous words may have multiple items |
| Card | Prompt, answer, type, knowledge item, revision | Meaning changes have schedule-impact policy |
| Question | Prompt, choice IDs, answers, explanation, goal | Correctness independent of display order |
| ReviewState | User, card, due time, scheduler version | Canonical state reproducible from events |
| ReviewEvent | ID, time, rating, assistance, revision | Append history; undo events |
| Attempt / Response | Assessment snapshot, selections, times, results | Include unanswered questions/explanation versions |
| AIJob / DraftBatch | Inputs, model, prompt version, results, costs | Jobs never publish automatically |
| ImportBatch | Schema, mapping, row results, deduplication key | Undo changes belonging to the batch |
| MediaAsset | Type, origin, rights, size, hash | Rights govern deletion/export |

### Example import-batch JSON

Self-authored source text illustrates structure. This sample payload is not a complete JSON Schema. File IDs map to app IDs and cannot overwrite others' objects. Approval declarations in files are untrusted.

```json
{
  "schema_version": "1.0",
  "deck": {
    "title": "Machine learning concepts",
    "language": "en"
  },
  "sources": [
    {
      "id": "s1",
      "type": "pasted_text",
      "title": "Personal notes",
      "text": "A loss function measures the discrepancy between predictions and targets."
    }
  ],
  "knowledge_items": [
    {
      "id": "k1",
      "title": "Role of the loss function",
      "source_refs": ["s1"]
    }
  ],
  "cards": [
    {
      "id": "c1",
      "type": "basic",
      "knowledge_item_id": "k1",
      "front": "What does a loss function measure?",
      "back": "The discrepancy between predictions and targets.",
      "source_refs": ["s1"]
    }
  ],
  "questions": [
    {
      "id": "q1",
      "type": "single_choice",
      "knowledge_item_id": "k1",
      "prompt": "According to the notes, what does a loss function measure?",
      "options": [
        {"id": "o1", "text": "Prediction discrepancy from the target"},
        {"id": "o2", "text": "Data file size"},
        {"id": "o3", "text": "Document page count"}
      ],
      "correct_option_ids": ["o1"],
      "explanation": "The notes define this role directly.",
      "source_refs": ["s1"]
    }
  ]
}
```

Implementation requires a real JSON Schema and fixtures for valid/invalid formats, missing answers, duplicate IDs, broken references and multilingual Unicode. Imports cannot grant verified status or ownership merely through file declarations.

## 18 End-to-end acceptance scenarios

| Code | Scenario | Required result | Related requirements |
| --- | --- | --- | --- |
| AC01 | Save a word, immediately close video tab | Queued item survives; retry creates no copy | EXT04, EXT07 |
| AC02 | Lose network after local save | Accurate status, sync after reconnect | EXT07 |
| AC03 | Switch accounts with pending items | Never send A's data to B | ACC01, EXT07 |
| AC04 | Change video/track, seek rapidly | No mixed translations/sources | EXT01, EXT02 |
| AC05 | No accessible subtitles | Explain, allow notes, preserve playback | EXT01, EXT10 |
| AC06 | Save two senses of one word | Explicit separation or correct-sense merge | LIB05, IMP03 |
| AC07 | Request 30 AI questions from short text | Appropriate count or more-source request; no fabricated filler | AI01–AI04 |
| AC08 | AI cites nonexistent source ID | Block or return correctable error | AI03, AI04 |
| AC09 | Duplicate choices/invalid answer ID | No publication until fixed | EDT04, IMP02 |
| AC10 | Shuffle choices repeatedly | Correct ID grading; no wrong A/B/C/D references | EDT04, STU03 |
| AC11 | Correct answer marked guessed | Recognition evidence, no card-SRS increase | STU03, SRS03 |
| AC12 | Submit review event twice | Apply once, traceable history | SRS02, SRS06 |
| AC13 | Change answer after results exist | Old attempt retains revision; edit notice | LIB04, STU04 |
| AC14 | Import 100 items with seven bad rows | Accurate errors; import 93 only on explicit choice | IMP02 |
| AC15 | Undo import that updated old items | Restore prior revisions without deleting unrelated edits | LIB04, IMP03 |
| AC16 | AI timeout/retry | No duplicate quota/content outside policy | AI06, OPS03 |
| AC17 | Video source removed | Cards/history survive; source access notice | LIB05, EXT10 |
| AC18 | Access another account's material URL | Server denies even with known ID | ACC01, section 16 |
| AC19 | Review across midnight/timezone changes | No duplicated reviews or incorrect streaks | SRS04 |
| AC20 | Complete study with keyboard | All essential actions available, correct focus | Sections 15 and 16 |

SRS cases need deterministic tests on identical histories. Translation/AI quality requires human content evaluation; UI/JSON tests cannot fully replace it.

## 19 MVP scope and roadmap

### Complete MVP package

A complete MVP enables manual creation/import, capturing a word and professional idea from YouTube, AI material approval, flashcard/quiz study and returning to scheduled review without data loss. Integrated AI needs text/capture generation initially, not every file type.

| Package | Delivery | Excluded initially |
| --- | --- | --- |
| Foundation | Accounts, decks, inbox, search, sources, revisions | Organizations/classes |
| Author/import | Basic/context cards, single-choice questions, CSV/TSV/JSON | APKG, executable templates, arbitrary URL imports |
| Study/review | Unaided flashcards, FSRS, quiz practice, basic assessments, mistake log | AI essay grading, proctoring |
| Extension | Compatible YouTube subtitles, English/Vietnamese translation, words/ideas, queue | Comprehensive Udemy/Coursera/ASR |
| AI | Text generation, references, drafts, approval, quotas | Advanced tutor, OCR, lecture recordings |
| Operations | Errors, exports, privacy, AI quality | Community marketplace/material sales |

### Milestones and gates

| Milestone | Outcome | Gate |
| --- | --- | --- |
| M0 Integration validation | YouTube subtitle/translation/timestamp prototype | Compatibility matrix, fallbacks, access/cost evaluation |
| M1 Learning core | Web creation/import/study/SRS/export | No lost/duplicate interrupted history; related ACs pass |
| M2 Video learning loop | Extension/inbox share an account | Trial users independently capture through first review |
| M3 Controlled AI | Source-based generation, review, errors, quotas | Content corpus passes, AI failures don't block study, agreed quality threshold |
| M4 MVP beta | All P0 integrated and measured | Return reviews, sustainable workload, manageable costs |
| M5 P1 expansion | Udemy/Coursera, formats, practice types | Actual demand; per-platform tests/maintainability |
| M6 P2 expansion | Groups, classes, community, media, advanced tools | Demand, operating model, moderation capacity |

M0 and data design precede later milestones. Avoid fixed weekly timelines without team size, experience, UI maturity and infrastructure knowledge. Trial M1 before all P0 delivery is possible.

### Complexity and dependencies

| Area | Relative complexity | Main dependencies/risks |
| --- | --- | --- |
| Accounts/material CRUD | Medium | ACL, revisions, autosave |
| Undoable CSV/JSON imports | Medium | Stable schema, deduplication, rollback |
| Flashcards/SRS | High | Event log, day boundaries, deterministic scheduler |
| Practice/assessment | Medium | Question versions, scoring, timing |
| YouTube extension | High | Player changes, subtitles, multiple tabs, permissions, service worker |
| Grounded/reviewed AI | High | Extraction, quality evaluation, cost, background jobs |
| Each added video platform | High | Separate validation/maintenance cycle |
| Multi-device offline review | High | Event merging/conflicts |
| Community/classes | High | Permissions, moderation, content rights, support |

### Early hypotheses to validate

1. Learners want professional knowledge alongside vocabulary and will approve materials after watching.
2. Returning to exact sources corrects misunderstandings and encourages continued use.
3. External AI imports reduce onboarding friction without excessive formatting repairs.
4. Captured volumes remain within review capacity rather than causing abandonment.
5. English/Vietnamese translations and Vietnamese questions are acceptable in selected subjects.

Start qualitative trials with approximately 10–15 people in the first two segments, observing real tasks before scaling. This sample is not sufficient to infer market-wide rates.

## 20 Product evaluation metrics

### Core metric

Proposed: **weekly learners who review material first studied at least seven days earlier and recall it without hints**. This reflects retention, but flashcard self-ratings and objectively graded answers must remain distinguishable, not merged without annotation.

### Operational and learning metrics

| Metric | Definition | Meaning |
| --- | --- | --- |
| Activation | New accounts with ≥5 approved items and a five-attempt session within 24 hours | Starting ability, not learning efficacy |
| Capture-to-review | Captures approved/reviewed within seven days / captures with seven days of observation | Detect saving without studying |
| D7/D30 return | Activated accounts studying within defined day windows | Retention with cohorts/sample counts |
| Delayed recall | First unaided attempts after ≥7 days / eligible attempts | Comparable content and task formats |
| Review backlog | Overdue counts and expected workload per learner | Detect excessive plans |
| AI quality | Evaluated factual correctness, valid grounding, repair rate | User approval alone is not truth evidence |
| Capture success | Server-confirmed saves / operations given sufficient sync time | Breakdown by site/version |
| Useful cost | Translation/AI cost per approved, actually studied item | Separate unused-generation cost |
| Material reports | Reported questions, confirmed-error rate, resolution time | Reliability monitoring |

D7 may cover days 7–13 and D30 days 30–36, consistently across dashboards. Immature cohorts are not dropouts. Background app-open time is not study time.

### Testing differentiated value

Compare word/meaning-only captures with original-sentence/source/context-card flows. Observe creation effort, review rate and delayed assessments. A/B studies need equivalent content/difficulty, sufficient data and privacy protections; more clicks alone do not demonstrate learning benefits.

Measure learning-loop quality before adding platforms. A broad extension with incorrect sources or no return-to-review behavior does not solve the core need.

## 21 References

Sources retrieved October 8, 2026. Product documents reflect public descriptions at the research date. For JavaScript-dependent pages, information is limited to indexed public content; actual platform support still requires pre-integration testing.

- **S01** Quizlet Help Center. [Creating sets by importing content](https://help.quizlet.com/hc/en-us/articles/360029977151-Creating-sets-by-importing-content). Importing content into sets.
- **S02** Quizlet Help Center. [Exporting your sets](https://help.quizlet.com/hc/en-us/articles/360034345672-Exporting-your-sets). Scope of user-created set exports.
- **S03** Quizlet Help Center. [Studying with Learn](https://help.quizlet.com/hc/en-us/articles/360030986971-Studying-with-Learn). Learn goals, options and access.
- **S04** Quizlet Help Center. [Studying with Test](https://help.quizlet.com/hc/en-us/articles/360030642972-Studying-with-Test-mode/). Assessments from sets.
- **S05** Quizlet Help Center. [Studying with Practice Tests](https://help.quizlet.com/hc/en-us/articles/25946589648013-Studying-with-Practice-Tests). AI tests and eligibility.
- **S06** Quizlet Help Center. [Studying with Spaced Repetition](https://help.quizlet.com/hc/en-us/articles/48324742264077-Studying-with-Spaced-Repetition). Recall-based review and web availability.
- **S07** Quizlet Help Center. [Studying with Ask Quizlet](https://help.quizlet.com/hc/en-us/articles/42790350723725-Studying-with-Ask-Quizlet). Explanations, cards, file support and regional limits.
- **S08** Quizlet Help Center. [Studying with Audio Notes](https://help.quizlet.com/hc/en-us/articles/47540466130829-Studying-with-Audio-Notes). Audio-to-material and card generation.
- **S09** Quizlet Help Center. [Create flashcard sets directly in ChatGPT](https://help.quizlet.com/hc/en-us/articles/44716146144909-Create-flashcard-sets-directly-in-ChatGPT). Creating sets and continuing study in Quizlet.
- **S10** Anki Manual. [Deck Options](https://docs.ankiweb.net/deck-options.html). FSRS, desired retention, workloads and scheduling options.
- **S11** Anki Manual. [Studying](https://docs.ankiweb.net/studying.html). Recording reviews and rating cards.
- **S12** Anki Manual. [Importing](https://docs.ankiweb.net/importing/intro.html) and [Exporting](https://docs.ankiweb.net/exporting.html). Text and deck package formats.
- **S13** RemNote Help Center. [Generating Flashcards with AI](https://help.remnote.com/en/articles/10102901-generating-flashcards-with-ai). Generating cards from selected content.
- **S14** RemNote. [AI Flashcards and Quizzes](https://www.remnote.com/feature/ai-flashcards). Cards, quizzes and note-linked materials.
- **S15** Brainscape Academy. [What Is Confidence Based Repetition](https://www.brainscape.com/academy/confidence-based-repetition-definition/). Confidence and repetition.
- **S16** Knowt. [Study tools and flashcard modes](https://knowt.com/). Imports, AI, Learn and spaced repetition.
- **S17** Wayground Help. [Question Types Explained](https://help.wayground.com/support/solutions/articles/158000411419-question-types-explained). Question formats.
- **S18** Wayground Help. [Create an Assessment or Quiz](https://help.wayground.com/support/solutions/articles/158000462332-create-an-assessment-quiz). Assessment creation, assignments and reports.
- **S19** Memrise. [Learn a language](https://www.memrise.com/en-us/). Videos, vocabulary and AI conversations.
- **S20** DuoCards. [Using DuoCards FAQ](https://www.duocards.com/en/faqs/). SRS, vocabulary and subtitles.
- **S21** DuoCards. [How to use DuoCards effectively](https://app.duocards.com/library/s/how-to-make-language-learning-with-flashcards-as-effective-as-possible). Word saving and extension use.
- **S22** Language Reactor. [Get Started](https://dev.languagereactor.com/help/basic). Video tools, dictionaries and saving; indexed public content.
- **S23** Language Reactor. [Export Help](https://www.languagereactor.com/help/export). Contextual word export and Anki options.
- **S24** Migaku. [Card creation from video content](https://migaku.com/blog/youtube/card-creation-from-video-content-migaku-browser-extension). Cards from subtitles and media.
- **S25** Migaku. [Features FAQ](https://migaku.com/faq/features). Lookup and content-learning controls.
- **S26** eJOY. [Link to Access to eJOY apps](https://ejoy-english.com/en/help/link-to-download-ejoy-products). App and extension ecosystem.
- **S27** eJOY. [Product overview](https://ejoy-english.com/en). Integrated platforms, subtitles and vocabulary review.
- **S28** Roediger and Karpicke, 2006. [Test enhanced learning](https://pubmed.ncbi.nlm.nih.gov/16507066/). Psychological Science 17, 249–255. DOI 10.1111/j.1467-9280.2006.01693.x.
- **S29** Cepeda et al., 2008. [Spacing effects in learning](https://pubmed.ncbi.nlm.nih.gov/19076480/). Psychological Science 19, 1095–1102. DOI 10.1111/j.1467-9280.2008.02209.x.
- **S30** Google for Developers. [YouTube Captions list](https://developers.google.com/youtube/v3/docs/captions/list). Track listing and authentication requirements.
- **S31** Google for Developers. [YouTube Captions download](https://developers.google.com/youtube/v3/docs/captions/download). Subtitle download eligibility.
- **S32** Udemy Support. [Finding Courses With Subtitles](https://support.udemy.com/hc/en-us/articles/229232287-Finding-Courses-With-Subtitles). Course-specific subtitles and languages.
- **S33** Coursera Help Center. [Download videos](https://www.coursera.support/s/article/learner-000001476?language=en_US). Transcripts/subtitles; indexed official descriptions.
- **S34** Chrome for Developers. [Declare permissions](https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions). API and site permissions.
- **S35** Chrome for Developers. [Manifest V3](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3). Extension model and remote-code restrictions.




