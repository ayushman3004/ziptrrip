# Features

Complete list of all features implemented in the Ziptrrip Todo application.

---

## Frontend Features

### TodoList Page (`/`)
| Feature | Description |
|---|---|
| Fetch all todos | Loads todos from the API on page mount |
| Real-time search | Filters by title as you type |
| Status filter | Filter by All / Active / Completed |
| Priority filter | Filter by All / High / Medium / Low |
| Sort by due date | Ascending or descending |
| Sort by priority | Ascending or descending |
| Sort direction toggle | Toggle asc/desc with a single button |
| Add todo | Opens AddEditModal with blank form |
| Edit todo | Opens AddEditModal pre-filled with todo data |
| Delete todo | Delete with a confirmation dialog |
| Toggle complete | Circular checkbox toggles complete/incomplete |
| Overdue indicator | Red left border + "Overdue" label on cards |
| Navigate to detail | Click todo title → window.location.href to `/todo?id=xxx` |
| Stats bar | Shows total count and completed count |
| Loading state | Animated spinner while fetching |
| Error state | Error banner with message |
| Empty state | SVG illustration with contextual message and Add button |

### TodoDetail Page (`/todo?id=xxx`)
| Feature | Description |
|---|---|
| Read ID from URL | Uses `new URLSearchParams(window.location.search)` |
| Independent fetch | Fetches todo by ID on page mount (no shared state) |
| Display all fields | ID (monospace), title, description, priority badge, status pill, created date, updated date, due date |
| Overdue indicator | "Overdue" badge in title row |
| Mark complete/incomplete | Toggle button changes label and status pill |
| Edit todo | Opens AddEditModal pre-filled, saves on submit |
| Delete todo | Confirmation dialog → deletes → redirects to `/` |
| Back button | `window.location.href = '/'` for full page reload |
| Loading state | Spinner while fetching |
| Error state | Error banner with back button |

### Shared UI Features
| Feature | Description |
|---|---|
| Dark mode toggle | System preference detected; persisted in `localStorage` |
| Light/dark themes | CSS variables for seamless theme switching |
| Google Fonts (Inter) | Modern typography via `@import` |
| Responsive layout | Mobile-friendly at 640px and below |
| Micro-animations | `slideIn`, `fadeIn`, scale animations on cards and modals |
| Glassmorphism header | Sticky header with `backdrop-filter: blur` |
| Gradient buttons | Primary button uses indigo-to-violet gradient |
| Priority color coding | Red (High), Amber (Medium), Green (Low) |

---

## Backend Features

### API Endpoints
| Feature | Description |
|---|---|
| POST `/api/todos` | Create a new todo |
| GET `/api/todos` | Get all todos |
| GET `/api/todos/:id` | Get a single todo by ID |
| PUT `/api/todos/:id` | Update a todo |
| DELETE `/api/todos/:id` | Delete a todo |
| Health check | `GET /health` returns server status |

### Query Parameters (GET `/api/todos`)
| Parameter | Description |
|---|---|
| `?search=` | Case-insensitive title search |
| `?status=active\|completed` | Filter by completion status |
| `?priority=low\|medium\|high` | Filter by priority |
| `?sortBy=dueDate\|priority` | Sort field |
| `?sortDir=asc\|desc` | Sort direction |

### Architecture & SOLID
| Feature | Description |
|---|---|
| Layered architecture | Routes → Controllers → Services → Repositories |
| Repository Pattern | `IRepository` abstract class, `FileRepository` concrete impl |
| Model factory | `createTodo()` generates full schema with defaults |
| Input validation | Title required, priority enum validated, ISO date validated |
| Custom error classes | `ValidationError` (400), `NotFoundError` (404) |
| Centralized error handler | 4-arg Express middleware maps errors to HTTP status codes |
| ES Modules | `"type": "module"` in package.json |
| CORS | Configured for `http://localhost:3000` |
| Auto data creation | `data/todos.json` auto-created if missing |

---

## ⭐ Bonus Features

| Feature | Description |
|---|---|
| Dark mode | System-aware light/dark toggle with `localStorage` persistence |
| Overdue detection | Cards and detail page flag overdue todos visually |
| Stats bar | Live count of todos and completed todos |
| Confirmation dialogs | Delete requires confirmation in both list and detail pages |
| Multiple sort fields | Sort by due date or priority with toggle direction |
| Health check endpoint | `GET /health` for server status |
| Action error display | Detail page shows inline error if toggle/delete fails |
| Flash prevention | `<script>` in `<head>` applies saved theme before React renders |
| Responsive design | Full mobile support with adapted layouts |
| Private class methods | `#readFile()` and `#writeFile()` in FileRepository (JS private fields) |
