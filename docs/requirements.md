# Requirements Document: Kanban Board (Study Project)

## 1. Goal
Build a simple Kanban board in plain HTML, CSS and JavaScript, with due dates and MoSCoW prioritization, as a study exercise over 14 days (30 min/day).

## 2. Board structure
- 3 fixed columns: **To Do**, **Doing**, **Done**
- No creating, editing or deleting columns

## 3. Card (task) fields
| Field | Required | Notes |
|---|---|---|
| Title | Yes | Short text |
| Description | No | Free text |
| Priority (MoSCoW) | Yes | Must / Should / Could / Won't |
| Due date | Yes | Single date |

## 4. Features (actions on a card)
- Create task
- Edit task
- Delete task
- Move task between columns (drag and drop)
- Visual highlight when the due date has passed

## 5. Persistence
- Data saved locally in the browser (localStorage)
- No backend, no database

## 6. Out of scope (MVP)
- Login / multiple users
- Multiple boards
- Attachments, comments, subtasks
- Notifications

## 7. Tech stack

### Front-end (days 1-14)
- HTML5
- CSS3 (flexbox or grid)
- Plain JavaScript (no framework)
- localStorage (persistence)
- Deploy: GitHub Pages or Vercel

### Back-end (days 15-21)
- Python + FastAPI
- SQLModel + SQLite
- Deploy: Render or Railway

## 8. Schedule

### Front-end (14 days, 30 min/day)
1. Planning and setup
2. HTML structure
3. Base CSS for the columns
4. Card CSS
5. Data model and rendering (JS)
6. Form to create a task
7. Drag and drop (part 1)
8. Drag and drop (part 2)
9. Persistence with localStorage
10. Edit and delete tasks
11. Overdue highlight and MoSCoW filter
12. Responsiveness and visual adjustments
13. General review and refactoring
14. Deploy, README and retrospective

### Back-end (7 days, 30 min/day)
15. Backend setup (FastAPI + SQLite)
16. Read and create routes
17. Update and delete routes
18. Validation and error handling
19. Front-end integration with the API
20. Tests and integration adjustments
21. Backend deploy and final retrospective