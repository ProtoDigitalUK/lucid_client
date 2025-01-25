# @lucidclient/elements

## v0.3.0

### Minor Changes

- Added support for handler specifiers to include multiple specifiers seperated by dot notation.
- All helpers are now exported. This means everything you may need to create third-party handlers can now be accessed.
- Event handler now supports registering event handlers on `document`, `body` and `head` by prefixing the event name with the target. Ie. `data-handler--event.document.click="myAction"`.



