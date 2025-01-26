# Elements

> Part of the Lucid Client suite

A lightweight, reactive UI library that bridges HTML and JavaScript through attributes. Elements brings reactive state and dynamic behaviors to your markup while maintaining simplicity - all powered by [SolidJS](https://www.solidjs.com/).

## Why Use Elements?

Elements is the perfect choice when you need just enough interactivity without the overhead of a full framework. It excels at common UI tasks like class toggling, event handling, and DOM manipulation while keeping your codebase lean. Whether you're building a small site or medium-sized application, Elements provides the essential reactive features you need with a minimal JavaScript footprint.

- 🔄 Two-way Data Binding - All `data-state--` attributes are kept in sync with their signals state. This means you can use them in CSS via attribute selectors for conditional UI.
- 🎨 Default State - As state is defined via an attribute, you can use it in CSS attribute selectors before the library is even initialised meaning no layout shifts and flashes of content.
- 🔒 No JS In Markup - This may sound like a missing feature, especially compared to a library like AlpineJS. Though we'd argue this is an anti-pattern as you loose type checking, LSP support, being able to compile and bundle the JS and the ability to import modules. It also doesnt work with the `unsafe-eval` CSP policy.
- ⚖️ HTML Spec Compliant - We are HTML spec compliant through the use of data- attributes. However we offer the ability to fully customise the attributes used, so if you dont like the syntax, you can change it to something more suited to your needs.
- 🌳 SolidJS Reactivity - We make use of SolidJS for reactivity, meaning the library remains performant and light weight.

## Installation

```bash
npm install @lucidclient/elements
```

## Getting Started

Basic setup:

```typescript
import Elements, { registerHandler } from "@lucidclient/elements";
import { events, dom, trap } from "@lucidclient/elements/handlers";

// registerHandler(events);

Elements.start({
    handlers: [events, dom, trap]
});
```

> Handlers can optionally be reigsterd with `registerHandler`. If you choose to do this, they must be registered before `Elements.start` is called.

## Core Concepts

### Stores

Stores are the foundation of Elements. They manage state and logic for sections of your HTML:

```html
<div 
    data-store="counter"
    data-state--count="0"
    data-state--is-active="true"
>
    <!-- Store content -->
</div>
```

Stores can be nested, allowing child elements to access parent store state:

```html
<div data-store="parent" data-state--expanded="true">
    <button data-store="child" data-bind--aria-expanded="parent:$expanded">
        <!-- Nested store -->
    </button>
</div>
```

### State Management

State is declared using `data-state--` attributes and supports:

- Strings: `data-state--name="John"`
- Numbers: `data-state--age="25"`
- Booleans: `data-state--active="true"`
- Objects: `data-state--user='{"name": "John"}'`
- Arrays: `data-state--items='["one", "two"]'`

> Note: Browser attributes are automatically lowercased, so use lowercase in your bindings (e.g., data-state--isactive not data-state--isActive).

These are reactive, meaning on change they will:

1. Update the state attribute on the element where it was registered.
2. Update any bind attributes that reference them.
3. Fire any side effects that handlers register. 
4. Fire any side effects that you register within store modules via the `createEffect` function.

### Attribute Bindings

Bind state `$` and actions `@` to HTML attributes using `data-bind--`:

```html
<button 
    data-bind--disabled="store:$loading"
    data-bind--aria-label="store:@getButtonLabel"
>
    Submit
</button>
```

Access object properties and array items:

```html
<span data-bind--text="store:$user.name">
<div data-bind--class="store:$items[0]">
```

### Built-in Handlers

#### Events Handler

Manages DOM event binding with support for `element`, `document`, `head`, `body` and `window` events:

```html
<button data-handler--event.click="store:@handleClick"></button>
<div data-handler--event.document.scroll="store:@handleScroll"></div>
<div data-handler--event.document.keydown="store:@handleKeydown"></div>
```

> Events arent curated, so any event specifier as long as the event exists, will work.

#### DOM Handler

Provides essential DOM manipulation capabilities:

```html
<!-- replaces the innerText with the resolved stte or action value -->
<div data-handler--dom.text="store:@getText"></div>
<!-- replaces the innerHTML with the resolved state or action value -->
<div data-handler--dom.html="store:@getHtml"></div>
<!-- scrolls to the target when the state or action resolves to true -->
<div data-handler--dom.scrollto="store:@shouldScrollTo"></div>
```

We current have support for the following specifiers: `text`, `html`, `value`, `focus`, `blur` and `scrollto`.

#### Focus Trap Handler

Manages focus trapping for modals and other interactive elements:

```html
<!-- Traps the target when the state or action resolves to true -->
<div data-handler--trap="store:$isOpen"></div>
<!-- Traps the target when true, but also makes the target inert when false -->
<div data-handler--trap.both="store:$isOpen"></div>
```

### Store Modules

Store modules contain your application logic and state management:

```typescript
import { storeModule, createSignal } from "@lucidclient/elements";

type NavStore = {
    state: {
        isOpen: boolean;
        ariaLabel: string;
    };
    actions: {
        toggle: () => void;
        getButtonLabel: () => string;
    };
}

storeModule<NavStore>("nav", (store) => ({
    state: {
        ariaLabel: createSignal("Open Navigation"),
    },
    actions: {
        toggle: () => {
            const [getOpen, setOpen] = store.state.isOpen;
            const [_, setAriaLabel] = store.state.ariaLabel;

            setOpen(prev => !prev);
            setAriaLabel(getOpen() ? "Close Navigation" : "Open Navigation");
		},
        getButtonLabel: () => {
            const [getOpen] = store.state.isOpen;
            return getOpen() ? "Close Navigation" : "Open Navigation";
        }
    },
    effects: {
        global: {},
        manual: {}
    },
    cleanup: () => {}
}));
```

### Element References

Use `data-ref` to reference elements in your store modules:

```html
<button data-ref="store:submitButton">Submit</button>
<div data-ref="store:items[]"><!-- Creates array of refs --></div>
```

Access in store modules:

```typescript
const button = store.refs.get("submitButton");
const items = store.refs.get("items"); // Array of elements
```

### Effects

Use `data-effect` to register effects in your store:

```html
<div data-effect="store:onOpenChange"></div>
```

```typescript
storeModule("store", (store) => ({
    state: {},
    actions: {},
    effects: {
        // any effect registered in global is iniitalised automatically
        global: {},
        // any effect registered in manual is only intitialised when its referenced in a `data-effect` attribute
        manual: {
            onOpenChange: (context) => {
                const [getOpen] = store.state.isOpen;
                console.log('Open?', getOpen(), context.isInitial);
            }
        }
    },
    cleanup: () => {}
}));
```

With effects, whenever a dependency updates (in the above case the isOpen signal), the effect will re-run.

## Limitations

- Array and object state mutations don't update their state attribute value. They do still trigger side-effect though, so any binding or handler that subscribed to them will still re-trigger.
