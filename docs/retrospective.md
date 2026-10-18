# Retrospective: Maras-Set-Kanban (front-end phase)

Live: https://o-maranhao.github.io/maras-set-kanban/

## What I built

A Kanban board in plain HTML, CSS and JavaScript: three columns, MoSCoW priority, due dates, overdue highlight, priority filter, drag and drop, edit and delete, `localStorage` persistence, responsive layout, light and dark themes, and animations. Deployed on GitHub Pages.

## Where the ideas came from

The two main concepts of the project come from classes with Dr. Rainara Maia at UFC, in the Software Processes and Human-Computer Interaction courses:

- **Kanban:** a visual way to manage work as cards that move through columns (here: To Do, Doing, Done), making the state of the work visible at a glance.
- **MoSCoW:** a prioritization technique that sorts items into Must have, Should have, Could have and Won't have (this time), used here as the priority badge and the filter.

The interface choices (contrast, feedback, consistency, color meaning) also connect to what was discussed in the Human-Computer Interaction classes.

## Libraries and tools

No libraries or frameworks: the project uses only what the browser provides. That was on purpose, to learn the fundamentals first.

- **HTML and CSS:** semantic elements, the native `<dialog>` element for the task form, flexbox and grid for layout, custom properties, media queries, `backdrop-filter` for the glass effect, `@property` for animating the wallpaper overlay.
- **JavaScript (browser APIs):** the HTML5 Drag and Drop API, `localStorage`, `matchMedia` (system theme and reduced motion), the Web Animations API (column height animation) and the View Transitions API (tried, then dropped, see below).
- **Workflow tools:** Git and GitHub for versioning, GitHub Pages for the deploy, and ClickUp to plan the 21 days (one task per day).
- **Testing:** done by hand in the browser (Firefox), checking both themes, mobile widths and the saved state after reloading.

## How the research went

- **Learning sources:** YouTube videos, code from friends and Stack Overflow answers were the main way I understood how things work in programming.
- **Visual design:** I used Apple's Human Interface Guidelines as the main reference, for contrast, system colors, dark mode and the typography scale. For font sizes I also looked at the public CSS of apple.com (17px base size, tight letter spacing).
- **Colors and meaning:** I researched color semantics to decide what each color should mean. Green means success, so it marks Done and not "Won't"; red marks Must and overdue; yellow marks Should and the main action; blue marks Could.
- **Fonts:** SF Pro is Apple's proprietary font and cannot be bundled in a website, so the CSS lists it first and falls back to the system font on other devices. A free lookalike did not fit the look, so I kept the system stack.
- **Problems found while building:** each problem (drop handling, theme switching, blur disappearing in Firefox) was solved by reproducing it, reading the relevant documentation and trying the smallest fix.

## What went well

- Planning the work in daily steps (one ClickUp task per day) kept the scope small, and every day ended with a commit.
- Rendering everything from one `tasks` array made new features cheap: edit, delete, filter and persistence all reused `renderBoard()`.
- Using Apple's Human Interface Guidelines as a reference gave the visual decisions a clear rule (contrast, system colors, type scale, dark mode) instead of guesswork.
- Fixing the theme and the colors only after looking at real screenshots caught problems that reading code did not.

## What I learned

- **State first, DOM second:** keep one source of truth and re-render from it, instead of editing the page by hand.
- **Drag and drop:** `dragstart`, `dragover` and `drop` need `preventDefault()`, and nested targets (cards inside columns) need `stopPropagation()` to avoid double handling.
- **CSS cascade:** a later rule or a `background` shorthand can silently undo an earlier one (for example, resetting `background-attachment`). Specificity and order matter more than they look.
- **Semantic color:** green reads as "good", so it should not mark "Won't". Colors carry meaning before they carry style.
- **Browser differences:** a circle reveal for the theme switch used View Transitions, which dropped `backdrop-filter` in Firefox. A plain crossfade on a live page was the robust option.
- **Saved choice vs system:** a stored user preference (theme) always wins over the system default, so testing the default needs a clean browser state.
- **Examples that age:** hard-coded example dates went stale, so they are now computed relative to the day the page is opened.

## Bugs worth remembering

- A typo (`Listener(...)` instead of `addEventListener`) broke column drops.
- Pasting a code block in the wrong place left delete and edit handlers half wired.
- Task number overlapped the title after moving it, fixed with padding on the title.

## What I would improve

- Add the description field to the task form (the model and cards already support it).
- Add a column selector in the edit form, for touch screens where dragging is awkward.
- Keyboard support for moving cards, and a visible focus style.
- Clean duplicated CSS rules left from the incremental changes.
- Simple automated tests for the pure helpers (`formatDate`, `isOverdue`, `dateFromToday`).
- Translate the planning documents to English to match the code.

## Next

Backend phase (days 15 to 21), planned for the future: FastAPI, SQLModel and SQLite, replacing `localStorage` with a REST API, then deploy.

## Schedule

I planned the project as 21 days of about 30 minutes each: 14 days for the front-end (done and deployed) and 7 for the backend (planned for the future). The plan is written in my requirements document (section 8) and was tracked as one ClickUp task per day.

### Front-end (days 1 to 14, done)

| Day | Task |
|---|---|
| 1 | Planning and setup |
| 2 | HTML structure |
| 3 | Base CSS for the columns |
| 4 | Card CSS |
| 5 | Data model and rendering (JS) |
| 6 | Form to create a task |
| 7 | Drag and drop (part 1) |
| 8 | Drag and drop (part 2) |
| 9 | Persistence with localStorage |
| 10 | Edit and delete tasks |
| 11 | Overdue highlight and MoSCoW filter |
| 12 | Responsiveness and visual adjustments |
| 13 | General review and refactoring |
| 14 | Deploy, README and retrospective |

### Backend (days 15 to 21, planned for the future)

| Day | Task |
|---|---|
| 15 | Backend setup (FastAPI + SQLite) |
| 16 | Read and create routes |
| 17 | Update and delete routes |
| 18 | Validation and error handling |
| 19 | Front-end integration with the API |
| 20 | Tests and integration adjustments |
| 21 | Backend deploy and final retrospective |