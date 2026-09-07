## applyTo: "**/*.js,**/*.mjs,**/*.cjs"

# JavaScript Review Rules

Review JavaScript files with particular attention to runtime behavior.

## Variables

Prefer const when reassignment is unnecessary.

Flag unnecessary mutation when it makes the code harder to reason about.

## Equality

Prefer strict equality:

```js
=== 
!== 
```

Avoid loose equality unless there is a deliberate reason.

## Optional Chaining

Use optional chaining when it improves safety and readability:

```js
user?.profile?.email
```

Do not use optional chaining to hide programming errors.

## Nullish Values

Be careful when using:

```js
|| 
```

when `0`, `false`, or an empty string are valid values.

Prefer:

```js
??
```

when the intended behavior is "null or undefined".

## Async/Await

Prefer async/await for asynchronous control flow.

Check for:

* missing await
* unhandled promises
* incorrect Promise.all usage
* accidental sequential execution
* race conditions

## Exceptions

Do not catch errors unless the code can:

* recover
* add useful context
* convert the error
* perform required cleanup

Avoid:

```js
try {
  await operation();
} catch {
}
```

## Object Mutation

Be careful when modifying shared objects.

Flag mutations that can create:

* unexpected shared state
* race conditions
* hidden side effects

## Array Operations

Check for:

* unnecessary multiple iterations
* accidental O(n²) operations
* mutation while iterating
* incorrect async callbacks

Do not use:

```js
array.forEach(async item => {
  await process(item);
});
```

when the caller expects the operation to complete.

Prefer appropriate `for...of` or `Promise.all()` semantics.

## JSON

Validate external JSON before trusting its structure.

Do not assume:

```js
JSON.parse()
```

will always succeed.

## Regular Expressions

Review complex regular expressions for:

* catastrophic backtracking
* ReDoS
* incorrect escaping
* excessive complexity

## Dynamic Code

Flag unnecessary use of:

```js
eval()
new Function()
```

and similar dynamic execution mechanisms.

## Prototype Pollution

Be careful when merging or assigning untrusted objects.

Review patterns involving:

```js
Object.assign()
```

deep merge utilities, and dynamic property assignment.

## Date and Time

Check timezone assumptions.

Avoid relying on server-local timezone behavior.

Use explicit timezone handling where business logic depends on dates or times.
