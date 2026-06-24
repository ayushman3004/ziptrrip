# API Documentation

Base URL: `http://localhost:3001/api`

All responses are JSON. Error responses follow the format:
```json
{
  "success": false,
  "error": {
    "name": "ErrorType",
    "message": "Human-readable message"
  }
}
```

---

## Endpoints

### 1. Create Todo

**`POST /api/todos`**

Creates a new todo item.

#### Request Body
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "low | medium | high (optional, default: medium)",
  "dueDate": "ISO 8601 string | null (optional)"
}
```

#### Response — `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design homepage mockup",
    "description": "Use Figma to design the landing page",
    "priority": "high",
    "completed": false,
    "dueDate": "2026-07-01T00:00:00.000Z",
    "createdAt": "2026-06-24T05:10:07.267Z",
    "updatedAt": "2026-06-24T05:10:07.267Z"
  }
}
```

#### Status Codes
| Code | Meaning |
|---|---|
| `201` | Todo created successfully |
| `400` | Validation error (title missing, invalid priority, invalid date) |
| `500` | Internal server error |

#### Validation Errors (400)
```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "title is required and must be a non-empty string; priority must be one of: low, medium, high"
  }
}
```

---

### 2. Get All Todos

**`GET /api/todos`**

Returns all todos. Supports optional filtering and sorting via query parameters.

#### Query Parameters
| Parameter | Type | Description |
|---|---|---|
| `search` | string | Case-insensitive title substring match |
| `status` | `active` \| `completed` | Filter by completion state |
| `priority` | `low` \| `medium` \| `high` | Filter by priority |
| `sortBy` | `dueDate` \| `priority` | Sort field |
| `sortDir` | `asc` \| `desc` | Sort direction (default: `asc`) |

#### Example Request
```
GET /api/todos?search=design&status=active&priority=high&sortBy=dueDate&sortDir=asc
```

#### Response — `200 OK`
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Design homepage mockup",
      "description": "Use Figma to design the landing page",
      "priority": "high",
      "completed": false,
      "dueDate": "2026-07-01T00:00:00.000Z",
      "createdAt": "2026-06-24T05:10:07.267Z",
      "updatedAt": "2026-06-24T05:10:07.267Z"
    }
  ]
}
```

#### Status Codes
| Code | Meaning |
|---|---|
| `200` | Success (may return empty array) |
| `500` | Internal server error |

---

### 3. Get Single Todo

**`GET /api/todos/:id`**

Returns a single todo by its UUID.

#### URL Parameters
| Parameter | Type | Description |
|---|---|---|
| `id` | UUID string | The todo's unique identifier |

#### Response — `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design homepage mockup",
    "description": "Use Figma to design the landing page",
    "priority": "high",
    "completed": false,
    "dueDate": "2026-07-01T00:00:00.000Z",
    "createdAt": "2026-06-24T05:10:07.267Z",
    "updatedAt": "2026-06-24T05:10:07.267Z"
  }
}
```

#### Status Codes
| Code | Meaning |
|---|---|
| `200` | Todo found |
| `404` | Todo not found |
| `500` | Internal server error |

#### Not Found Response (404)
```json
{
  "success": false,
  "error": {
    "name": "NotFoundError",
    "message": "Todo with id \"550e8400-e29b-41d4-a716-446655440000\" not found"
  }
}
```

---

### 4. Update Todo

**`PUT /api/todos/:id`**

Updates an existing todo. Only provided fields are updated (partial update supported).

#### URL Parameters
| Parameter | Type | Description |
|---|---|---|
| `id` | UUID string | The todo's unique identifier |

#### Request Body (all fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "low | medium | high",
  "completed": true,
  "dueDate": "ISO 8601 string | null"
}
```

#### Response — `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated title",
    "description": "Updated description",
    "priority": "low",
    "completed": true,
    "dueDate": null,
    "createdAt": "2026-06-24T05:10:07.267Z",
    "updatedAt": "2026-06-24T05:30:00.000Z"
  }
}
```

#### Status Codes
| Code | Meaning |
|---|---|
| `200` | Updated successfully |
| `400` | Validation error |
| `404` | Todo not found |
| `500` | Internal server error |

---

### 5. Delete Todo

**`DELETE /api/todos/:id`**

Permanently deletes a todo.

#### URL Parameters
| Parameter | Type | Description |
|---|---|---|
| `id` | UUID string | The todo's unique identifier |

#### Response — `204 No Content`
_(Empty body)_

#### Status Codes
| Code | Meaning |
|---|---|
| `204` | Deleted successfully |
| `404` | Todo not found |
| `500` | Internal server error |

---

### 6. Health Check

**`GET /health`**

Returns server status and current timestamp.

#### Response — `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-06-24T05:10:01.252Z"
}
```

---

## Todo Schema

| Field | Type | Default | Notes |
|---|---|---|---|
| `id` | UUID string | auto | Generated by `uuid.v4()`, immutable |
| `title` | string | — | Required, max 200 chars |
| `description` | string | `""` | Optional |
| `priority` | `low\|medium\|high` | `"medium"` | Validated enum |
| `completed` | boolean | `false` | Can be toggled via PUT |
| `dueDate` | ISO string \| null | `null` | Optional |
| `createdAt` | ISO string | auto | Set on creation, immutable |
| `updatedAt` | ISO string | auto | Updated on every PUT |
