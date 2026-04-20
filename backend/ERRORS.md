# 📘 Uniform Error Handling System (Copy-Paste Ready)

## 🎯 Goal

Implement a **consistent, user-friendly error handling system** across the entire application (API + validation + services).

This ensures:

* Same error structure everywhere
* Clear messages for users
* Structured data for frontend
* Easy debugging and scalability

---

## 🧱 Standard Error Response Format

All errors MUST follow this structure:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Please check your input and try again.",
  "errors": {
    "email": ["Please enter a valid email address"],
    "password": ["Password must include a number"]
  }
}
```

---

## 📌 HTTP Status Codes

| Type         | Code |
| ------------ | ---- |
| Validation   | 400  |
| Unauthorized | 401  |
| Forbidden    | 403  |
| Not Found    | 404  |
| Conflict     | 409  |
| Server Error | 500  |

---

## 🧩 Error Types

### Validation Error

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Please check your input.",
  "errors": {
    "email": ["Invalid email format"]
  }
}
```

### Business Logic Error

```json
{
  "success": false,
  "code": "USER_ALREADY_EXISTS",
  "message": "An account with this email already exists."
}
```

### Server Error

```json
{
  "success": false,
  "code": "INTERNAL_ERROR",
  "message": "Something went wrong. Please try again later."
}
```

---

## 🛠 Implementation

### 1. Create Custom Error Class

```js
class AppError extends Error {
  constructor(message, code = "APP_ERROR", status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

module.exports = AppError;
```

---

### 2. Create Error Formatter for Zod

```js
function formatZodErrors(issues) {
  const errors = {};

  issues.forEach((issue) => {
    const field = issue.path.join(".") || "form";

    if (!errors[field]) errors[field] = [];
    errors[field].push(issue.message);
  });

  return errors;
}

module.exports = formatZodErrors;
```

---

### 3. Global Error Handler (Express)

```js
const { ZodError } = require("zod");
const formatZodErrors = require("./formatZodErrors");

function errorHandler(err, req, res, next) {
  console.error(err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Please check your input and try again.",
      errors: formatZodErrors(err.issues),
    });
  }

  // Custom application errors
  if (err.code) {
    return res.status(err.status || 400).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  // Fallback error
  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Something went wrong. Please try again later.",
  });
}

module.exports = errorHandler;
```

---

### 4. Example Usage

```js
const AppError = require("./AppError");

if (userExists) {
  throw new AppError(
    "An account with this email already exists.",
    "USER_ALREADY_EXISTS",
    409
  );
}
```

---

### 5. Zod Schema Example

```ts
import { z } from "zod";

const schema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(12, { message: "Password must be at least 12 characters long" }),
});
```

---

## 🧠 Frontend Integration

* Use `message` → show general error
* Use `errors[field]` → display field-specific errors
* Use `code` → handle logic (e.g., redirect on 401)

---

## ❌ Do Not

* Return raw stack traces
* Use inconsistent formats
* Send vague messages like `"Something failed"`
* Expose internal error details

---

## ✅ Definition of Done

* [ ] All endpoints return the same error format
* [ ] Zod errors are grouped by field
* [ ] Messages are user-friendly
* [ ] Custom errors use `AppError`
* [ ] No raw errors leak to client

---

## 🚀 Result

* Clean API responses
* Better user experience
* Easier frontend integration
* Production-ready error handling

---
