# Work Breakdown Structure (WBS)

## 1.0 Exercise Planning

### 1.1 Review the acceptance criteria

- [ ] Confirm the deliverable is an `index.html` page with a semantic DOM architecture and accessibility contract.
- [ ] Record the constraint that `<div>` elements are not permitted.
- [ ] Record the required landmark elements: `header`, `nav`, and `main`.
- [ ] Record the required accessibility attributes: a skip link, `role="banner"` on the header, `aria-label="Primary"` on the navigation, and `role="main"` on the main content.

### 1.2 Inspect the starter project

- [ ] Identify the current HTML entry point and its existing content.
- [ ] Check the repository status before editing.

## 2.0 Build the Semantic Landmark Structure

### 2.1 Add the skip-navigation link

- [ ] Add an early-page link targeting `#main-content`.
- [ ] Use meaningful link text, such as “Skip to Content”.

### 2.2 Create the page header

- [ ] Add a `<header role="banner">` landmark.
- [ ] Include the page owner or role heading inside the header (for example, “Jane Doe, Lead Engineer”).

### 2.3 Create the primary navigation

- [ ] Add a `<nav aria-label="Primary">` landmark after the header.
- [ ] Use an unordered list for navigation items.
- [ ] Add internal links for the About and Projects sections.

### 2.4 Create the main-content landmark

- [ ] Add `<main id="main-content" role="main">` after navigation.
- [ ] Ensure its `id` exactly matches the skip link target.

### 2.5 Add semantic content sections

- [ ] Add an `<section id="about">` for About content.
- [ ] Add an `<section id="projects">` for Projects content.
- [ ] Give each section an appropriate heading and content.

### 2.6 Enforce the HTML constraint

- [ ] Review the document and remove or replace any `<div>` elements with appropriate semantic HTML.

## 3.0 Validate Accessibility and Structure

### 3.1 Verify keyboard behavior

- [ ] Tab to the skip link from the top of the page.
- [ ] Activate the skip link and confirm focus or navigation reaches `#main-content`.

### 3.2 Verify the landmark tree

- [ ] Open browser DevTools.
- [ ] Open the Accessibility panel.
- [ ] Verify the landmark tree exposes the banner, primary navigation, and main regions in the intended order.

### 3.3 Final HTML review

- [ ] Confirm navigation links point to existing section IDs.
- [ ] Confirm headings and landmarks form a logical reading order.
- [ ] Confirm no forbidden `<div>` elements remain.

## 4.0 Version-Control Submission

### 4.1 Stage the semantic HTML change

- [ ] Review the diff to ensure it contains only the HTML landmark work for this exercise.
- [ ] Stage the completed HTML file.

### 4.2 Create the atomic commit

- [ ] Commit using: `git commit -m "feat(html): semantic landmark tree"`.
- [ ] Do not combine CSS work with this HTML commit.

### 4.3 Confirm completion

- [ ] Verify the commit appears in Git history.
- [ ] Confirm the working tree is clean or document any unrelated pre-existing changes.

## 5.0 Exercise 2: Enterprise Developer Portfolio

### 5.1 T-02A: Design Tokens and Global Reset

- [ ] Define color, typography, spacing, surface, and border tokens as CSS custom properties in `:root`.
- [ ] Define token values for both light and dark themes.
- [ ] Add a global reset that applies `box-sizing: border-box` to every element and pseudo-element and removes default margins and padding.
- [ ] Establish base typography and page styles using the tokens and a readable system font stack.
- [ ] Confirm regular CSS rules contain no hardcoded hexadecimal colors; use CSS variables instead.
- [ ] Commit only this work with `git commit -m "feat(css): tokens & reset"`.

### 5.2 T-02B: Responsive Two-Dimensional Grid Layout

- [ ] Identify the portfolio content that benefits from a two-dimensional layout, including project cards.
- [ ] Build the layout with CSS Grid and an autonomous responsive pattern such as `repeat(auto-fit, minmax(280px, 1fr))`.
- [ ] Use `gap` for consistent spacing between grid items.
- [ ] Style the layout and cards exclusively through the established CSS custom properties.
- [ ] Test at a 375px viewport and resolve overflow until horizontal scrolling is eliminated.
- [ ] Verify the grid remains legible and balanced at larger viewport widths.
- [ ] Commit only this work with `git commit -m "feat(css): responsive grid"`.

### 5.3 T-02C: Accessible Theme Engine

- [ ] Add a visible, keyboard-operable theme control with an `aria-pressed` state.
- [ ] On initialization, read the saved preference only from `localStorage` key `theme`.
- [ ] Apply the selected theme through a state that maps to the existing CSS variables.
- [ ] Persist every user-selected preference only to `localStorage` key `theme`.
- [ ] Update the control’s ARIA state and visual indicator whenever the theme changes.
- [ ] Test repeated theme changes for zero console errors.
- [ ] Commit only this work with `git commit -m "feat(js): dark mode engine"`.

### 5.4 Exercise 2 Acceptance Verification

- [ ] Verify full keyboard navigation using Tab and Enter, including the theme control.
- [ ] Check all foreground and background color token pairings meet WCAG 2.2 AA contrast of at least 4.5:1.
- [ ] In DevTools Fast 3G mode, confirm LCP is below 2.0 seconds.
- [ ] Confirm the page has zero cumulative layout shift (CLS).
- [ ] Confirm the layout has no horizontal scroll at 375px.
- [ ] Change one CSS token and restore the expected appearance within 60 seconds as live-defense practice.
- [ ] Verify CSS and JavaScript changes remain in separate commits; combining them is not permitted.

**Exercise 2 definition of done:**

- [ ] Tokens and global reset are committed independently.
- [ ] A responsive 2D grid is committed independently and works at 375px without horizontal scrolling.
- [ ] The accessible theme engine is committed independently and persists state only with `localStorage` key `theme`.
- [ ] The page meets contrast, LCP, CLS, keyboard-navigation, and console-error acceptance criteria.

## 6.0 Exercise 3: Component Architecture and State Modeling

### 6.1 Define Component Contracts

- [ ] Review and approve each component contract before implementation begins.

| Component | Semantic and data contract | Required states and behavior | Accessibility contract |
| --- | --- | --- | --- |
| Hero | A named introductory region containing one page-level heading, professional pitch, and portrait image. The image must have descriptive `alt`, explicit `width`, and explicit `height`. | Static content; the portrait reserves its display space before loading. | The heading establishes the page topic, and the portrait description conveys meaningful image content without duplicating nearby text. |
| Theme switcher | A native `button` identified by `#theme-toggle`; the active theme is stored only in `localStorage` key `theme` and reflected on the document with `data-theme`. | Supports `light` and `dark`; initialization restores a valid saved state or uses the system preference; activation toggles state and persistence. | The button has an understandable visible action label and `aria-pressed`, which is `true` only for dark mode; it supports Tab, Enter, and Space. |
| Skills matrix | A named skills section containing categories and labeled skill badges; layout hooks may use `skills-grid`, `skill-category`, and `skill-badge` classes. | Static skill data grouped by category; content wraps without loss or overlap. | The section and categories use headings, and badge text remains readable in source order. |
| Project card | One self-contained `article` per project with `project-card` class and a `data-category` value. Each card contains a heading, description, technology tags, and one destination link. | Static display state initially; category data remains separate from presentation so filtering can be added later. | The card heading is an `h3` under the projects heading; each destination link has a descriptive accessible name. |
| Contact form | A native `form` with explicit visible labels, stable field IDs, suitable input types, and a submission control. | `idle`, `submitting`, `success`, and `error`; duplicate submission is blocked while submitting, and feedback is exposed after success or failure. | Every control is labeled; validation and submission feedback is programmatically associated with the affected field or form and announced without requiring a mouse. |

- [ ] Keep data, behavior, and presentation decoupled: semantic markup holds content and data attributes, CSS controls appearance, and JavaScript owns state changes and event handling.
- [ ] Keep each component self-contained so a contract change is limited to that component and its documented interfaces.
