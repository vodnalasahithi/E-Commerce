## applyTo: "src/models/**/*.js,src/routes/**/*.js,src/middleware/**/*.js"

# Node.js API Review

Review API code for correctness, security, reliability, and consistent HTTP behavior.

## Authentication

Protected routes must authenticate the caller before accessing protected resources.

Check for authentication bypasses.

## Authorization

Authentication alone is not sufficient.

Verify that the authenticated user has permission to access the requested resource.

Pay particular attention to IDs supplied through:

* URL parameters
* query parameters
* request bodies

## Input Validation

Validate:

```js
req.body
req.params
req.query
req.headers
req.cookies
```

Do not trust client-provided values.

## HTTP Status Codes

Check that status codes match the actual outcome.

Typical examples:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Do not expose internal errors as successful responses.

## Error Handling

Controllers should not leak:

* stack traces
* database errors
* credentials
* internal paths
* infrastructure details

## Request Size

Check whether endpoints accepting:

* JSON
* files
* multipart forms
* arbitrary text

have appropriate size limits.

## Rate Limiting

Authentication, password reset, OTP, search, upload, and expensive endpoints should be considered for rate limiting.

## CORS

Review CORS configuration carefully.

Avoid:

```js
origin: "*"
```

for authenticated applications unless the behavior is explicitly intended and safe.

## Headers

Where appropriate, use established security middleware rather than implementing security headers manually.

## Pagination

Collection endpoints should avoid returning unbounded datasets.

Review:

```http
GET /users
GET /orders
GET /transactions
```

for pagination requirements.

## API Compatibility

Check whether changes break existing clients.

Pay attention to:

* renamed fields
* removed fields
* changed types
* changed status codes
* changed error structures
* changed authentication requirements
