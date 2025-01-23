# @lucidclient/speculate

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