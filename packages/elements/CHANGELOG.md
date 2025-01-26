# @lucidclient/elements

## v0.3.0

### Minor Changes

- Added support for handler specifiers to include multiple specifiers seperated by dot notation.
- All helpers are now exported. This means everything you may need to create third-party handlers can now be accessed.
- Event handler now supports registering event handlers on `document`, `body` and `head` by prefixing the event name with the target. Ie. `data-handler--event.document.click="myAction"`.
- Breaking change: all state values in `data-bind--` attributes must be prefixed with `$`. Ie. `data-bind--aria-label="scope:$state"`.
- All first-party handlers now support using state as well as actions. Just prefix the value with either a `$` or `@` to denote the member type.
- Added a new first party handler for trapping focus. This can be used via the `data-handler--trap` attribute and supports both member types.
- Added a new optional cleanup callback for store modules.
- Added a new `data-effect` attribute for registering effects through attributes.
