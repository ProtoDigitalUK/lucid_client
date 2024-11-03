# Elements

> Part of the Lucid Client suite

A lightweight, reactive UI library that bridges HTML and JavaScript through attributes. Elements brings reactive state and dynamic behaviors to your markup while maintaining simplicity - all powered by [SolidJS](https://www.solidjs.com/).

## Why Use Elements?

Elements is the perfect choice when you need just enough interactivity without the overhead of a full framework. It excels at common UI tasks like class toggling, event handling, and DOM manipulation while keeping your codebase lean. Whether you're building a small site or medium-sized application, Elements provides the essential reactive features you need with a minimal JavaScript footprint.

- Attributes Stay Synced: All `data-state--` attributes are kept in sync with their signals state, meaning you cas use them in CSS with attribute selectors.
- Default State: As state is defined via an attribute, you can use it in CSS attribute selectors before the library is even initialised meaning no layout shifts and flashes of content.
- No Functions In Markup: This may sound like a missing feature, especially compared to a library like AlpineJS. Though we'd argue this is an anti-pattern as you loose type checking, LSP support, being able to compile and bundle the JS and the ability to import modules. It also doesnt work with the `unsafe-eval` CSP policy.
- Two Way Data Binding: This means you can update the state attributes independently of the library and Elements will keep in sync.
- HTML Spec Compliant: We are HTML spec compliant through the use of data- attributes. However we offer the ability to fully customise the attributes used, so if you dont like the syntax, you can change it to something more suited to your needs.
- SolidJS Reactivity: We make use of SolidJS for reactivity, meaning the library remains performant and light weight.

## Installation

To install the Lucid Elements library, run the following command:

```bash
npm install @lucidclient/elements
```

## Elements Usage

Import `Elements`, register any required handlers and store modules and call the `start` function.

```typescript
import Elements, { registerHandler } from "@lucidclient/elements";
import { events, dom } from "@lucidclient/elements/handlers";

registerHandler(events);
registerHandler(dom);

Elements.start();
```

> Elements is built to be tree-shakeable, so you can import only the handlers you need.

### HTML Markup

```html
<header
    data-store="nav"
    data-state--open="false"
    class="h-10 bg-black text-white"
>
    <div class="flex justify-between items-center">
        <h1>Elements</h1>
        <button
            data-handler--event.click="nav:toggle"
            data-bind--aria-expanded="nav:open"
            data-bind--aria-label="nav:ariaLabel"
            aria-controls="main-nav"
        >
            <span data-handler--dom.text="nav:buttonLabel"> Open Navigation </span>
        </button>
    </div>
    <nav
        id="main-nav"
        data-bind--aria-hidden="nav:@closed"
        class="[&[aria-hidden='false']]:translate-x-0 fixed inset-0 top-10 bg-gray-800 z-50 transition-transform duration-200 translate-x-full p-2.5"
        aria-label="Main navigation"
        aria-hidden="true"
    >
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>
```

### Store Modules

Store modules allow you to extend the state and define actions for your element stores. In Elements all of your logic should exist within the store module, as opposed to defining functions in HTML markup. This has a few added benefits such as having LSP support, being able to be compiled and bundled, and being able to import modules etc.

```typescript
import Elements, { storeModule, createSignal } from "@lucidclient/elements";

type NavStoreState = {
    open: boolean;
    ariaLabel: string;
}

type NavStoreActions = {
    toggle: (e: Event) => void;
    closed: () => boolean;
}

storeModule<NavStoreState, NavStoreActions>("nav", (store) => ({
    state: {
        ariaLabel: createSignal("Open Navigation"),
    },
    actions: {
        toggle: () => {
            const [getOpen, setOpen] = store.state.open;
            const [_, setAriaLabel] = store.state.ariaLabel;
            // const overlayElement = store.refs.get("overlay");

            if (getOpen()) setAriaLabel("Open Navigation"); 
            else setAriaLabel("Close Navigation");

            setOpen((prev) => !prev);
        },
        closed: () => {
            const [getOpen] = store.state.open;
            return !getOpen(); 
        },
        buttonLabel: () => {
            const [getOpen] = store.state.open;
            return getOpen()
                ? "Close Navigation"
                : "Open Navigation";
        },
    },
}));

Elements.start();
```

> All store modules need to be defined before running the `Elements.start()` function.

## Attributes

There are 4 main types of attributes Elements currently registers, these allow you to register state, binds, handlers and refs.

### Store `data-store`

To denote an element as a store, use the `data-store` attribute. This requires a value to be set against it, which is used to scope state and handler actions as well as to reference a store module if you choose to register one.

Stores can be nested, so you can have a parent element with a store and a child element with a store. This then allows children to reference the parent store via the scoped state.

```html
<header
    data-store="nav"
    data-state--open="false"
>
    <div
        data-store="content"
        data-state--label="Hello World"
        data-bind--aria-expanded="nav:open"
    >
        <button data-handler--dom.text="content:label"></button>
    </div>
</header>
```

### State `data-state--`

Any element that has a store registered against with via the `data-store` attribute can also register state via the `data-state--` attribute. You can define these using the `data-state--{statekey}="{value}"` attribute, where the `statekey` is the name of the signal and the value is the default value. These support a few different data types including `string`, `number`, `boolean`, `object` and `array`.

These are reactive, meaning on change they will:

1. Update the state attribtue on the element where it was registered.
2. Update any bind attributes that reference them.
3. Fire any side effects that you register within store modules via the `createEffect` function.

Unlike the `string`, `number` and `boolean` state data types, `array` and `object` state types do not have their state attributes updated when they're mutated, however they do still update attribute bindings, and if you update the state attribute programmatically, that state will be still be kept in sync.

These are two way binded, meaning if the attribute value is changed outside of the Elements library, Elements will keep the states signal in sync still.

> Please keep in mind that the browser will normalise the attribute name to lowercase, so `data-state--isDisabled` is turned into `data-state--isdisabled`. This lowercase attribute name is whats used as the state key and so when referencing it in attribute bindings, you must use the lowercase version.

### Bind `data-bind--`

This syntax indicates an attribute binding and takes the name of the state or action you want to bind to the attribute. When the state is mutated, the attribute will be updated to reflect the new value.

For example, if you had an attribute binding of `data-bind--disabled="example:state"`, whenever the state signal changes on the example store, the attribute of `disabled` will be updated to reflect that new value. You can also bind to actions, so if you had an action called `isDisabled` in your store module, you could bind to it with `data-bind--disabled="example:@isDisabled"` which use the returned value as the attribute value.

For `array` and `object` state types you can reference values and indexes using dot and bracket notation respectively. Ie. `data-bind--data-object="example:object.hello"` and `data-bind--data-array="example:array[0]"`.

Note you cannot do any conditional logic in binds, so something like `data-bind--disabled="example:boolean1 != example:boolean2"` will not work. This is because for the time being we are not able to make use of `eval` or function constructors to evaluate the expression due to the `unsafe-eval` CSP policy. If you want to do something like this, you can set the value to that of a action on your store module and have the action return the condition instead.

### Handler `data-handler--`

All handlers are prefixed with `data-handler--` and are registered through plugins. By default Elements doesnt register any handlers, but includes a few first-party built-in plugins for event handling, basic DOM manipulation and potentially more down the line.

The naming is `data-handler--namesapce.specifier="action"`.

These call user defined actions that are registered via store modules. Much like the `bind` attribute, you cannot do any conditional logic in handlers, so something like `data-handler--dom.text="example:open ? 'Open' : 'Close'"` will not work. This may change in the future, but for now we've decided to not support this due to the `unsafe-eval` CSP policy.

### Refs `data-ref="name"`

Refs are used to select elements and store them so you can easily access them from within you store modules. These are stored as a Map against the store, with the key being the attribute value and the value being the element of type Element or ELement[].

Any attributes that are suffixed with `[]` will be stored as an array of elements with the same name.

## Missing Features:

- Detailed documentation and examples via the [Lucid JS webiste](https://lucidjs.build/elements).
- Handlers for focus trapping, intersection observers, etc. These may be released separately.