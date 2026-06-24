# Architecture

A deep-dive into the design decisions, patterns, and SOLID principles applied in this project.

---

## Layered Architecture

```
Client (Browser)
      │
      ▼ HTTP Request
┌─────────────────┐
│   Routes        │  routes/todos.js — Maps HTTP verbs/paths to controller functions
│   (Express)     │  No logic. Pure routing table.
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  Controllers    │  controllers/todoController.js — Reads req, calls service, writes res
│                 │  No business logic. Pure HTTP adapter.
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│   Services      │  services/todoService.js — All business rules, validation, sorting
│                 │  No HTTP knowledge. No file I/O.
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  Repositories   │  repositories/FileRepository.js — All data persistence
│  (IRepository)  │  Implements IRepository interface.
└────────┬────────┘
         │ reads/writes
         ▼
┌─────────────────┐
│   Data Source   │  data/todos.json — JSON flat file
│                 │  (swap for MongoDB, PostgreSQL, etc.)
└─────────────────┘
```

Each layer only communicates with the layer directly below it. This enforces:
- **Testability**: Each layer can be unit-tested in isolation
- **Replaceability**: Swap storage without touching the service layer

---

## Repository Pattern

The Repository Pattern decouples the data access logic from the rest of the application.

### How It Works

`IRepository` (abstract base class) defines the contract:
```js
// repositories/IRepository.js
export class IRepository {
  async findAll(filters) { throw new Error('Not implemented'); }
  async findById(id)     { throw new Error('Not implemented'); }
  async create(data)     { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id)       { throw new Error('Not implemented'); }
}
```

`FileRepository` is the concrete implementation:
```js
// repositories/FileRepository.js
export class FileRepository extends IRepository {
  async findAll(filters) { /* reads todos.json, applies filters */ }
  async findById(id)     { /* reads todos.json, finds by id */ }
  async create(data)     { /* reads, appends, writes todos.json */ }
  async update(id, data) { /* reads, mutates, writes todos.json */ }
  async delete(id)       { /* reads, splices, writes todos.json */ }
}
```

The `todoService.js` only imports and uses `IRepository`'s interface. To switch storage:

### Swapping to MongoDB: Zero Service Changes Required

```js
// repositories/MongoRepository.js
import { IRepository } from './IRepository.js';
import { Todo } from '../models/Todo.js'; // Mongoose model

export class MongoRepository extends IRepository {
  async findAll(filters) { return Todo.find(filters); }
  async findById(id)     { return Todo.findById(id); }
  async create(data)     { return Todo.create(data); }
  async update(id, data) { return Todo.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id)       { return Todo.findByIdAndDelete(id); }
}
```

Then in `todoService.js`, change just one line:
```js
// Before:
const repository = new FileRepository();

// After:
const repository = new MongoRepository();
```

No changes needed in routes, controllers, or middleware. This is the power of the repository pattern.

---

## SOLID Principles

### S — Single Responsibility Principle
> "A class/module should have only one reason to change."

Each file in this project has exactly one job:

| File | Responsibility |
|---|---|
| `server.js` | Bootstrap Express, mount middleware and routes |
| `routes/todos.js` | Define HTTP endpoints |
| `controllers/todoController.js` | Handle req/res only |
| `services/todoService.js` | Business logic and validation |
| `repositories/FileRepository.js` | File I/O only |
| `models/Todo.js` | Define the Todo data shape |
| `middleware/errorHandler.js` | Map errors to HTTP responses |

**Example:** If you want to change how todos are stored (switch to a database), you only modify `FileRepository.js`. Nothing else needs to change.

---

### O — Open/Closed Principle
> "Software entities should be open for extension, but closed for modification."

The `IRepository` base class is **closed for modification** — its interface is fixed. But the system is **open for extension** — you can add `MongoRepository`, `RedisRepository`, or `MemoryRepository` without touching existing code.

```js
// IRepository is the stable abstraction (never changes)
class IRepository {
  async findAll() { throw new Error('Not implemented'); }
}

// New storage backends are extensions, not modifications
class MongoRepository extends IRepository { /* ... */ }
class RedisRepository extends IRepository { /* ... */ }
```

---

### L — Liskov Substitution Principle
> "Subtypes must be substitutable for their base types."

`FileRepository` can be substituted for `IRepository` anywhere in the codebase without breaking behavior.

```js
// todoService.js works identically with FileRepository or MongoRepository
const repository = new FileRepository(); // or new MongoRepository()

// Both respond to the exact same method signatures
await repository.findAll({ search: 'test' });
await repository.findById('some-uuid');
```

The service never needs to check `instanceof` — both implementations honor the same contract.

---

### I — Interface Segregation Principle
> "Clients should not be forced to depend on interfaces they do not use."

`IRepository` defines only the methods that a Todo repository needs — no more, no less. The controller does not depend on the repository at all; it only uses the service. The service does not depend on Express; it uses plain JavaScript objects.

Each layer depends on the minimal interface it needs:
- Route → Controller function signature
- Controller → Service method signature
- Service → Repository method signatures (findAll, findById, create, update, delete)
- Repository → File system APIs

---

### D — Dependency Inversion Principle
> "High-level modules should not depend on low-level modules. Both should depend on abstractions."

The service (high-level) depends on `IRepository` (the abstraction), not on `FileRepository` (the concrete low-level implementation).

```js
// services/todoService.js
import { FileRepository } from '../repositories/FileRepository.js';

// In a real DI container, this would be injected:
const repository = new FileRepository();

// The service calls methods defined in IRepository (the abstraction)
await repository.findAll(filters);  // ← this is the IRepository contract
```

The service does not know — or care — that the data is stored in a JSON file. It only knows the abstract interface. This means the storage mechanism can be swapped at runtime without the service knowing.

---

## Frontend Architecture

### Page Isolation
Each page (`TodoList`, `TodoDetail`) fetches its own data independently:
- `TodoList` uses `useTodos` hook → calls `fetchTodos()`
- `TodoDetail` uses `useTodo(id)` hook → calls `fetchTodoById(id)`

No global state (Redux, Context, etc.) is shared between pages. Each page load is a fresh data fetch, satisfying the "multi-page" requirement.

### Hook Pattern
Custom hooks encapsulate all state management:
```
useTodos.js ← TodoList page state (filters, list, CRUD)
useTodo.js  ← TodoDetail page state (single todo, update/delete)
```

Pages are thin — they just render UI and call hook methods.

### Navigation
Navigation between pages uses `window.location.href` (not React Router's `useNavigate`) to force a full page reload. This ensures each page's data is always freshly loaded.

### API Layer Separation
All `fetch()` calls are isolated in `src/api/todoApi.js`. No page or hook calls `fetch()` directly. This makes it easy to:
- Mock the API in tests
- Change the base URL in one place
- Add auth headers globally
