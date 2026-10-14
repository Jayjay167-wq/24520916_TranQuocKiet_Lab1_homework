
---

# Work Breakdown Structure: Homework 1, 2 & 3

> Decomposition rule (Lab 1): every task follows the 4 stages:
> **(1) Functional Slicing → (2) Contract Definition → (3) Atomic Generation (one sub-task per AI prompt) → (4) Contract Verification (test in isolation before integrating).**
> No monolithic AI prompts. No commit combines unrelated concerns (e.g. CSS + JS, or HTML + CSS).

## Global Constraints (apply to HW1, HW2, HW3)

- Vanilla HTML5, modern CSS, ES6+ JS only. No jQuery, Bootstrap, Tailwind, or external script CDNs.
- `const` by default, `let` only when reassigned, never `var`.
- No inline handlers (`onclick=...` is banned). Bind events with `addEventListener`.
- Never render unescaped user input with `innerHTML`.
- Mobile-first: verify 375px before desktop, zero horizontal scroll.
- Serve via Live Server (`http://localhost:5500`), never `file:///`.
- Keyboard events: `keydown` + `event.key` (no `keypress`, no `keyCode`).
- Commit format: `type(scope): message`. One concern per commit.

---

## HW1: Production Portfolio (min. 4 atomic commits)

**Goal:** Harden the Exercise 2 developer portfolio to production standard: accessible, keyboard-safe, CSP-compliant, and Lighthouse 100.
**Assumption:** HW1 audits and hardens the existing portfolio (semantic landmarks, tokens, grid, theme engine) rather than rebuilding it.

| ID | Sub-task | Contract (defined BEFORE prompting AI) | Verification gate | Commit |
|----|----------|----------------------------------------|-------------------|--------|
| HW1-M0 | Spec: record this WBS | Milestones, contracts, and gates listed in this file | WBS committed before any code change | `docs(spec): define HW1 milestones & contracts` |
| HW1-M1 | WCAG 2.2 AA audit | Text/background contrast >= 4.5:1 in light AND dark themes; landmarks `header/nav/main/footer`; one `<h1>`; no skipped heading levels; every `<input>` has a visible `<label for>`; images have `alt`, `width`, `height` | DevTools → Accessibility → landmark tree verified; Lighthouse a11y check; contrast checked for both themes | `fix(a11y): contrast & landmarks` |
| HW1-M2 | Focus-trap / keyboard audit | Full Tab/Shift+Tab/Enter flow; no keyboard trap (including theme toggle, nav, form, any `<dialog>`); visible `:focus-visible` style; skip-link works | Navigate whole page with keyboard only (no mouse); focus order matches visual order | `fix(nav): keyboard trap prevention` |
| HW1-M3 | Strict CSP + zero inline handlers | `Content-Security-Policy` meta/header with no `unsafe-inline` for scripts; no `onclick=`/inline `on*` attributes; no external scripts; all behavior in `.js` files | Zero CSP violations in console; `grep -rn "on[a-z]*=" *.html` finds no handlers; theme toggle still works | `feat(security): strict CSP & remove inline handlers` *(proposed message)* |
| HW1-M4 | Lighthouse 100 + assets | Images sized (zero CLS), `loading="lazy"` / `decoding="async"` where appropriate, WebP/AVIF via `<picture>`, no unused CSS/JS | Lighthouse: Performance, Accessibility, Best Practices, SEO all 100; CLS = 0; LCP < 2.0s on Fast 3G | `perf: optimize assets` |

**Order:** M0 → M1 → M2 → M3 → M4 (each verified in isolation before the next).
**Penalty watch:** monolithic PRs or one-shot AI code = 0 pts for architecture.

---

## HW2: Drum Kit Engine (Contract-First)

**Goal:** Keyboard-driven drum kit with the data contract, audio engine, input layer, and recorder fully decoupled.

### Contract (frozen at Step 1)

- Each pad: `<button class="drum-pad" data-key="a" data-sound="sounds/kick.wav">` (or `<kbd>` inside a button).
- Audio engine exposes: `playSound(src)` and `stopAll()`. It knows nothing about the DOM or key events.
- Input layer reads `e.key` + `e.repeat`, looks up the pad via `data-key`, and passes `pad.dataset.sound` to the engine.
- Recorder stores `{ sound, t }` entries (`t` = ms from recording start via `performance.now()`) in a FIFO queue.

| ID | Sub-task | Contract / scope | Verification gate (in isolation) | Commit |
|----|----------|------------------|----------------------------------|--------|
| HW2-S0 | Spec | WBS + contract above | Committed before any HTML/JS | `docs(spec): define drum kit contracts & WBS` |
| HW2-S1 | HTML `data-sound` contract | Semantic markup (landmarks, zero unnecessary `<div>`), one `data-key` + `data-sound` per pad, labels visible | Inspect DOM: every pad has both attributes; no JavaScript touched | `feat(html): data-sound contract for drum pads` |
| HW2-S2 | Polyphonic audio engine | Standalone module; each trigger creates its own `Audio` instance so sounds overlap; `stopAll()` halts active audio; no DOM/event dependencies | Call `playSound()` from the DevTools console: overlapping sounds work, `stopAll()` works | `feat(js): implement decoupled audio engine logic` |
| HW2-S3 | `keydown` listener + throttling | `keydown` + `event.key` (case-normalized); `if (e.repeat) return`; unknown keys ignored; adds/removes `.active` class for feedback | Hold a key: one sound only; press unmapped key: no error; zero console errors | `feat(js): bind keydown events with repeat throttling` |
| HW2-S4 | FIFO Beat Recorder | Start/stop/play-back; timestamped event queue (enqueue on trigger, dequeue in order on playback); playback goes through the same engine API | Record a sequence, play it back with the same timing; queue empties in FIFO order | `feat(js): implement FIFO beat recorder` |

**Live-defense readiness (3 min):** keep each change to one line.
- Rename `data-sound` → `data-audio-src`: only the HTML attribute and the single `dataset` read in the input layer change.
- Add Spacebar to halt all audio: one `keydown` branch calling `stopAll()`.
- Change a key binding: only the `data-key` attribute changes.

---

## HW3: Resilient Event Hub & AI Failure Audit (min. 5 atomic commits)

**Goal:** Resilient landing page built in 3 slices, plus a documented audit of AI-induced defects.

| ID | Slice / sub-task | Contract | Verification gate | Commit |
|----|------------------|----------|-------------------|--------|
| HW3-S0 | Spec | Slice contracts, state diagram, ISO 8601 target date constant | Committed before code | `docs(spec): define HW3 slices & state machine` |
| HW3-S1 | Drift-free countdown engine | Target stored as a UTC ISO 8601 string (e.g. `2026-12-01T09:00:00Z`); remaining time computed from `Date.now()` on every tick (never by decrementing a counter, so no `setInterval` drift); interval cleared at zero and on teardown (no memory leak); output via `textContent` | Throttle CPU / switch tabs: displayed time stays accurate; change system timezone: result unchanged; no leaked timers | `feat(js): drift-free UTC countdown engine` |
| HW3-S2 | State-machine form | States: `idle → submitting → success \| error`; one `state` variable, one `setState()` function that updates UI (disabled button, status text via `aria-live`); native validation (`required`, `type="email"`, `minlength`); visible labels | Drive each state manually (force success and error); illegal transitions rejected; screen reader announces status | `feat(js): form state machine` |
| HW3-S3 | Double-submit prevention + sanitization | Submit ignored unless state is `idle`; button disabled while `submitting`; all user input rendered with `textContent` or escaped (no unescaped `innerHTML`) | Double-click / press Enter twice: exactly one request; submit `<img src=x onerror=alert(1)>`: renders as inert text | `fix(security): double-submit guard & input sanitization` |
| HW3-A1 | AI Failure Mode Report | `AI_FAILURE_AUDIT.md` with 3 defects, each with: **(1) Defect description**, **(2) Diagnostic method** (Git diff inspection or DevTools breakpoint), **(3) Refactored solution** | Each defect traceable to a specific commit/diff; fixes verified | `docs(audit): AI failure mode report` |

**AI_FAILURE_AUDIT.md skeleton** (fill with defects you actually catch; candidates: `setInterval` drift, `innerHTML` XSS, timezone parsing of non-ISO dates, un-cleared intervals, missing double-submit guard):

```md
## Defect 1: <title>
- **Description:** what the AI produced and why it is wrong
- **Diagnostic method:** git diff / DevTools breakpoint used to find it
- **Refactored solution:** your verified fix (link the commit)
```

**Prompting rule:** one slice per AI prompt. Passing the whole spec at once is the monolithic-dump penalty.
**Live defense:** be ready to explain any line in your Git history.

---

## Cross-Homework Verification Checklist (5 Quality Gates)

- [ ] **Functional:** all acceptance criteria met
- [ ] **Responsive:** clean at 375px, no horizontal scroll
- [ ] **Accessible:** 100% keyboard navigable (Tab/Enter), WCAG 2.2 AA contrast
- [ ] **Performance:** clean Lighthouse run, zero CLS
- [ ] **Security & code health:** zero XSS, no inline handlers, clean indentation, no dead code, no unauthorized dependencies
