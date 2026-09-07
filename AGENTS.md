# Repository Engineering Context

## Application

This repository contains a Node.js backend application.

## Architecture

Use the following conceptual layers:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories / Database
```

Routes should primarily define HTTP routing and middleware.

Controllers should translate HTTP requests into application operations.

Services should contain business logic.

Repositories should contain database-specific operations.

Do not place substantial business logic directly inside route definitions.

## General Rules

* Keep controllers thin.
* Keep business logic in services.
* Validate external input.
* Authenticate and authorize protected operations.
* Do not expose internal errors.
* Never commit secrets.
* Use async/await.
* Prefer explicit error handling.
* Write tests for meaningful behavior changes.

## Database

Database access should remain isolated from HTTP concerns.

Avoid making database queries directly from route definitions unless there is a strong architectural reason.

## Security

Assume all external input is untrusted.

Never trust:

* user IDs
* roles
* permissions
* prices
* account IDs
* resource ownership

Validate authorization on the server.

## Pull Requests

Pull requests should preferably contain:

1. Implementation
2. Tests
3. Required documentation changes

Avoid unrelated refactoring.

## Review Philosophy

Favor high-signal findings.

Do not report:

* formatting preferences
* subjective naming preferences
* hypothetical problems without evidence
* issues already handled elsewhere

Focus on bugs, security vulnerabilities, reliability, performance, and maintainability.
