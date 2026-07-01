# ÉLIXIR REST API Architecture

## 1. API URL Convention

Base API path:

```text
/api/v1
```

API groups:

```text
/api/v1/public/...
/api/v1/admin/...
/api/v1/auth/...
```

Purpose:

* `/public` is for customer-facing public APIs.
* `/admin` is for protected admin operations.
* `/auth` is for authentication-related APIs.
* `/api/v1` allows future versioning without breaking existing clients.

---

## 2. REST Naming Convention

Use nouns, not verbs.

Correct:

```text
GET    /api/v1/public/products
GET    /api/v1/public/products/{id}
POST   /api/v1/admin/products
PUT    /api/v1/admin/products/{id}
PATCH  /api/v1/admin/products/{id}
DELETE /api/v1/admin/products/{id}
```

Do not use:

```text
/createProduct
/updateProduct
/deleteProduct
/getProducts
```

Resource names must be plural:

```text
products
categories
orders
users
settings
offer-tags
```

---

## 3. HTTP Status Policy

| Case                       | Status                    |
| -------------------------- | ------------------------- |
| GET success                | 200 OK                    |
| POST success               | 201 Created               |
| PUT success                | 200 OK                    |
| PATCH success              | 200 OK                    |
| DELETE soft delete success | 204 No Content            |
| Validation failure         | 400 Bad Request           |
| Unauthorized               | 401 Unauthorized          |
| Forbidden                  | 403 Forbidden             |
| Resource not found         | 404 Not Found             |
| Duplicate/conflict         | 409 Conflict              |
| Unexpected server error    | 500 Internal Server Error |

---

## 4. Standard Success Response

All successful API responses should follow one structure.

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {},
  "timestamp": "2026-07-01T16:00:00",
  "path": "/api/v1/public/products"
}
```

Fields:

* `success`: always `true` for success responses.
* `message`: human-readable result message.
* `data`: response payload.
* `timestamp`: response time.
* `path`: request path.

For `204 No Content`, no response body is required.

---

## 5. Standard Error Response

All error responses should follow one structure.

```json
{
  "timestamp": "2026-07-01T16:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/admin/products",
  "validationErrors": {
    "name": "Name is required",
    "price": "Price must be positive"
  }
}
```

Fields:

* `timestamp`: error time.
* `status`: HTTP status code.
* `error`: HTTP error name.
* `message`: readable error message.
* `path`: request path.
* `validationErrors`: field-level validation messages. Null or empty when not applicable.

---

## 6. Global Exception Handling Architecture

Future implementation should use:

```java
@RestControllerAdvice
```

Exception mapping:

| Exception                       | HTTP Status |
| ------------------------------- | ----------- |
| ResourceNotFoundException       | 404         |
| DuplicateResourceException      | 409         |
| BusinessValidationException     | 400         |
| MethodArgumentNotValidException | 400         |
| Exception                       | 500         |

Rules:

* Do not expose stack traces to API clients.
* Log unexpected exceptions internally.
* Return standardized error response.
* Validation errors should include field-level messages.

---

## 7. Pagination Standard

Paginated responses should follow this structure:

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5,
  "sort": "createdAt,desc",
  "first": true,
  "last": false
}
```

Rules:

* Page index starts from `0`.
* Default size should be `20`.
* Maximum page size should be decided before controller implementation.
* Sorting format should be `field,direction`.

Example:

```text
/api/v1/public/products?page=0&size=20&sort=createdAt,desc
```

---

## 8. Swagger/OpenAPI Documentation Plan

Swagger is not integrated in Phase 3A.

Future documentation strategy:

Title:

```text
ÉLIXIR Backend API
```

Version:

```text
v1
```

Groups:

```text
Public APIs
Admin APIs
Authentication APIs
```

Future grouping:

* Public APIs: product browsing, categories, public order tracking.
* Admin APIs: product management, order management, settings.
* Authentication APIs: register, login, refresh token, logout.

---

## 9. Controller Package Design

Future controller package structure:

```text
com.elixir.service
├── publicapi
│   └── controller
├── admin
│   └── controller
├── auth
│   └── controller
```

Alternative module-local structure may be used only if architect approves.

Preferred Phase 3B structure:

```text
com.elixir.service.publicapi.controller
com.elixir.service.admin.controller
com.elixir.service.auth.controller
```

Reason:

* Clear separation of public, admin, and auth APIs.
* Easier future security configuration.
* Avoids mixing public and admin controllers inside domain packages.

---

## 10. Versioning Strategy

Current version:

```text
/api/v1
```

Future versions:

```text
/api/v2
```

Rules:

* Do not break existing `/api/v1` clients.
* Breaking response/request changes require a new version.
* Non-breaking additions may remain in the same version.

---

## 11. Future Authentication Layout

Authentication APIs will be placed under:

```text
/api/v1/auth
```

Future examples:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Admin APIs will later require admin authorization:

```text
/api/v1/admin/...
```

Public APIs will remain unauthenticated unless architect decides otherwise:

```text
/api/v1/public/...
```

---

## 12. Phase 3A Scope Confirmation

This phase is architecture-only.

No controllers, endpoints, APIs, JWT, security, authentication, authorization, service changes, repository changes, entity changes, DTO changes, or database changes are included.
