# GitHub Copilot Code Review Instructions

## Purpose

You are reviewing a production Node.js application.

Your primary goal is to identify real bugs, security vulnerabilities, reliability problems, performance problems, incorrect behavior, and maintainability issues.

Do not make comments merely for stylistic preferences unless they violate the repository's established conventions.

Prioritize actionable findings over general observations.

---

# Review Priority

Review issues in this order:

1. Critical security vulnerabilities
2. Authentication and authorization problems
3. Data corruption or incorrect business logic
4. Runtime errors and crashes
5. API contract violations
6. Sensitive data exposure
7. Database/query problems
8. Performance problems
9. Error handling and reliability
10. Test coverage and test correctness
11. Maintainability
12. Code style

Do not report trivial formatting issues unless they can cause a real problem.

---

# Node.js Standards

This repository uses modern Node.js.

Prefer:

* async/await
* ES modules when supported by package.json
* const over let when variables are not reassigned
* small focused functions
* explicit error handling
* dependency injection where appropriate
* reusable services
* pure functions where practical

Avoid:

* unnecessary callbacks
* deeply nested conditionals
* synchronous filesystem APIs in request handlers
* blocking CPU-intensive operations
* global mutable state
* unnecessary singleton state
* duplicated business logic

---

# Async Code

Check every asynchronous operation carefully.

Look for:

* missing await
* promises that are not returned
* unhandled promise rejections
* race conditions
* sequential awaits that could safely run in parallel
* accidental fire-and-forget operations
* missing timeout handling
* retry logic that can create duplicate operations

Prefer:

```js
const result = await service.execute();
```

instead of unnecessary promise chains.

When multiple independent asynchronous operations can run concurrently, consider:

```js
const [users, orders] = await Promise.all([
  getUsers(),
  getOrders()
]);
```

Do not recommend Promise.all when operations have ordering dependencies or when parallel execution could overload an external service.

---

# Error Handling

Every external operation must have appropriate error handling.

Pay particular attention to:

* database operations
* HTTP requests
* filesystem operations
* message queues
* third-party APIs
* authentication providers

Check that errors:

* are not silently swallowed
* contain enough context for debugging
* do not expose secrets
* are converted into appropriate HTTP responses
* do not leak stack traces in production

Avoid:

```js
try {
  await operation();
} catch (error) {}
```

unless there is a documented reason.

---

# API Review

For HTTP APIs, verify:

* request validation
* response validation where appropriate
* correct HTTP status codes
* authentication
* authorization
* consistent error responses
* pagination for large collections
* rate limiting where appropriate
* request size limits
* timeout handling
* idempotency for sensitive operations

Never trust client-provided:

* user IDs
* account IDs
* roles
* permissions
* prices
* ownership information

Authorization must be enforced server-side.

---

# Security

Treat security findings as high priority.

Check for:

## Secrets

Never hardcode:

* API keys
* passwords
* tokens
* private keys
* database credentials
* JWT secrets

Flag secrets accidentally committed to source code.

Prefer environment variables or a secure secret-management system.

---

## Injection

Look for:

* SQL injection
* NoSQL injection
* command injection
* LDAP injection
* template injection
* path traversal
* unsafe shell execution

Be especially suspicious of:

```js
exec(userInput);
```

```js
query(`SELECT * FROM users WHERE id = ${userId}`);
```

```js
eval(userInput);
```

---

# Authentication

Review:

* password handling
* session management
* JWT validation
* token expiration
* refresh token handling
* authentication middleware
* logout/revocation behavior

Passwords must never be stored as plaintext.

Prefer established password hashing libraries such as Argon2 or bcrypt.

---

# Authorization

Authentication is not authorization.

Verify that users can only access resources they are authorized to access.

Look for IDOR/BOLA vulnerabilities such as:

```http
GET /users/123/orders
```

where the server trusts the supplied user ID without checking ownership.

---

# Input Validation

All external input must be treated as untrusted.

Check:

* req.body
* req.params
* req.query
* headers
* cookies
* uploaded files
* webhook payloads

Validate:

* type
* format
* length
* allowed values
* numeric ranges
* object structure

Prefer established validation libraries such as Zod, Joi, or equivalent.

---

# Database

Review database access for:

* SQL injection
* missing indexes
* N+1 queries
* unnecessary queries
* missing transactions
* race conditions
* incorrect transaction boundaries
* connection leaks
* unbounded queries
* missing pagination

Check that database connections are correctly managed.

---

# Performance

Look for:

* O(n²) algorithms where avoidable
* unnecessary database queries
* N+1 queries
* excessive API calls
* large synchronous operations
* memory leaks
* unbounded arrays/maps
* expensive JSON processing
* unnecessary serialization
* repeated computation

Do not optimize code merely because an alternative is theoretically faster.

Only report meaningful performance risks.

---

# Logging

Logs must not expose:

* passwords
* API keys
* access tokens
* refresh tokens
* authorization headers
* session cookies
* sensitive personal information

Prefer structured logging.

Include useful context such as:

* request ID
* operation
* relevant resource ID
* error type

when appropriate.

---

# Dependency Security

Review changes to package.json and package-lock.json carefully.

Check for:

* unnecessary dependencies
* suspicious packages
* outdated vulnerable dependencies when the change introduces or upgrades them
* dependency confusion risks
* packages that duplicate existing functionality

Do not recommend dependency changes without a concrete reason.

---

# Tests

Every meaningful behavior change should have appropriate tests.

Check:

* happy path
* validation failures
* authorization failures
* error cases
* edge cases
* regression scenarios

Tests should not only test implementation details.

Prefer testing observable behavior.

For bug fixes, verify that a regression test exists when practical.

---

# Test Quality

Flag tests that:

* do not actually assert behavior
* contain meaningless assertions
* mock the code under test excessively
* are dependent on execution order
* rely on real external services unnecessarily
* are flaky
* leave test data behind

---

# API Error Responses

API errors should be predictable and safe.

Prefer a consistent structure such as:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

Do not expose internal implementation details.

Avoid returning:

* stack traces
* SQL queries
* filesystem paths
* internal service names
* secrets

---

# Filesystem and Process Execution

Treat filesystem paths and process arguments derived from users as dangerous.

Review:

* path traversal
* arbitrary file reads
* arbitrary file writes
* command injection
* unsafe child_process usage

Be especially careful with:

```js
exec()
execSync()
spawn()
spawnSync()
```

---

# HTTP Requests

Review outbound HTTP calls for:

* timeouts
* retries
* retry storms
* authentication
* error handling
* response validation
* SSRF
* excessive payload sizes

Never assume an external API always returns the expected response.

---

# SSRF

Pay special attention when a user can influence a URL.

Potentially dangerous patterns include:

```js
await fetch(req.body.url);
```

Verify:

* allowed protocols
* allowed hosts
* redirects
* private IP ranges
* localhost
* cloud metadata endpoints

---

# Environment Variables

Do not assume environment variables exist.

Validate required configuration during application startup.

Avoid silently using insecure defaults for:

* JWT secrets
* database credentials
* encryption keys
* authentication settings

---

# Express / HTTP Middleware

For Express-style applications, check:

* middleware ordering
* authentication middleware
* authorization middleware
* error middleware
* body size limits
* CORS configuration
* security headers
* rate limiting

Authentication middleware must execute before protected handlers.

---

# Business Logic

Focus heavily on business correctness.

Check for:

* incorrect calculations
* incorrect status transitions
* duplicate operations
* missing authorization
* race conditions
* invalid state transitions
* timezone bugs
* currency rounding problems
* date/time assumptions

Do not assume business logic is correct merely because the code compiles.

---

# Concurrency

Look for race conditions involving:

* balances
* inventory
* counters
* status transitions
* payments
* reservations
* account updates

If read-modify-write logic is used, verify that concurrent requests cannot corrupt state.

---

# Pull Request Scope

Check whether the PR is focused.

Flag:

* unrelated refactoring
* unnecessary dependency changes
* accidental file modifications
* debug code
* commented-out production code
* generated files committed unnecessarily

Do not reject a PR simply because it contains harmless refactoring if the refactoring is clearly related to the change.

---

# Review Comment Rules

Only report an issue when:

1. There is a concrete problem.
2. The problem is caused or materially affected by the changed code.
3. The issue can reasonably be fixed.
4. The finding provides enough context for the developer to understand the problem.

Avoid vague comments such as:

* "This could be better."
* "Consider improving this."
* "This isn't ideal."

Instead explain:

* what is wrong
* why it matters
* how it can fail
* the recommended fix

---

# Severity

Use these priorities:

## High

Use High when the issue can cause:

* security vulnerabilities
* data loss
* privilege escalation
* authentication bypass
* production crashes
* serious data corruption
* severe incorrect business behavior

## Medium

Use Medium when the issue can cause:

* incorrect behavior in realistic scenarios
* significant performance degradation
* reliability problems
* missing authorization in limited scenarios
* difficult-to-recover operational failures

## Low

Use Low for:

* minor maintainability problems
* small reliability improvements
* non-critical edge cases

Do not create Low comments for purely stylistic preferences.

---

# False Positive Prevention

Before reporting a finding:

1. Inspect surrounding code.
2. Check how the function is called.
3. Check relevant tests.
4. Check configuration.
5. Check package.json dependencies.
6. Check whether validation already happens upstream.
7. Check whether authorization already happens in middleware.
8. Check whether the behavior is intentional.

Do not report an issue if repository context clearly shows that it is already handled.

---

# Final Review

At the end of the review, prioritize findings by severity.

Do not praise every part of the implementation.

Do not produce a long summary if there are no actionable findings.

If there are no meaningful issues, state that no actionable problems were found.

The goal is a high-signal code review, not a style critique.
