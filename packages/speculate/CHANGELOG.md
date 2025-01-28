# @lucidclient/speculate

## v1.1.0

## Minor Changes

- Added a new `refresh` method to `Speculator`.

## v1.0.1

## Patch Changes

- `onClick` callback now returns `Event`.
- `TargetElements` now supports being null | undefined so you dont have to check prior to passing them to Speculator.

## v1.0.0

### Major Changes

- Reworked the `PrefetchData` class into `Speculator`.
- `Speculator` includes better cache management, support for multiple elements, error handling and optimistic prefetching.

## v0.3.0

### Minor Changes

- Added the ability to destroy the instance. This will destroy any event listeners, abort fetch requests and tidy up any generated script/link elements.
- Fixed a bug where `checkConnection` wasnt being used.

## v0.2.1

### Patch Changes

- Fixed a bug where rel attributes with multiple values would not be parsed correctly.
- Added validation for the rel speculation actions and triggers.

## v0.2.0

### Minor Changes

- Added fallback support for Safari via `fetch`.
- Script is deferred using `requestIdleCallback` if available to not block the main thread.

## v0.1.0

### Minor Changes

- The initial release of the Speculate library.