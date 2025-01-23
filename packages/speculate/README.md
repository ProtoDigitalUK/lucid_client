# Speculate

> Part of the Lucid Client suite

A simple library designed to enhance anchor elements by adding support for prefetching and prerendering. By default this uses the new experimental [Speculation Rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules) API, but falls back to `<link rel="prefetch">` or `fetch` when not supported. Additionally, the library features a `PrefetchData` class, enabling asynchronous data fetching based on user interactions with specified targets.

## Features

- Prefetch or prerender documents using Speculation Rules, `<link rel="prefetch">` or `fetch` as a fallback.
- Support for `visible`, `immediate`, `eager`, `moderate` and `conservative` triggers.
- PrefetchData class for asynchronous data fetching based on user intent.

## Getting Started

### Installation

To install the Lucid Speculate library, run the following command:

```bash
npm install @lucidclient/speculate
```

### Speculate Usage

Initialise the library by calling the `speculateLinks` function.

```typescript
import { speculateLinks } from "@lucidclient/speculate";

speculateLinks();

// You can destroy and cleanup the instance like so:
// const destroy = speculateLinks();
// destroy();
```

Define the actions and triggers for your links using the `rel` attribute. For each action (prefetch or prerender) you can specify a trigger (visible, immediate, eager, moderate or conservative). For example:

```html
<a href="/page-1" rel="prefetch:visible">I will prefetch when I enter the viewport</a>
<a href="/page-2" rel="prefetch:moderate">I will prefetch when a user interacts with me</a>

<a href="/page-3" rel="prerender:visible">I will prerender when I enter the viewport</a>
<a href="/page-4" rel="prerender:moderate">I will prerender when a user interacts with me</a>
```

Aside from the `visible` trigger, the others are based on the [Speculation Rule Eagerness](https://developer.chrome.com/docs/web-platform/prerender-pages#eagerness) values and are used only when Speculation Rules are supported. 

When Speculation Rules are not supported, the only valid triggers are `visible` and `moderate`. The `moderate` trigger being a fallback for the remaining triggers. The `prerender` action is ONLY supported with Speculation Rules and will fallback to the `prefetch` action when not supported.

### Browser Support

#### Chrome

Chrome supports Speculation Rules, allowing for both prefetching and prerendering as intended. Chrome will always use the Speculation Rules API.

#### Firefox

Firefox does not support the Speculations API, but does support `<link rel="prefetch">`, however this requires cache headers (such as Cache-Control, Expires, or ETag) to function properly.

#### Safari

Safari doesn't support either the Speculation Rules API or `<link rel="prefetch">`. Instead, it uses a low-priority fetch, which requires cache headers (such as Cache-Control, Expires, or ETag) to function properly.

### Prefetch Data Usage

To use the PrefetchData class, import the `PrefetchData` class and intialise a new instance of it per target.

```typescript
import { PrefetchData } from "@lucidclient/speculate";

new PrefetchData({
    target: "#load-data",
    fetch: () => {
        return fetch("/api/users").then((res) => res.json());
    },
    onClick: (data) => {
        console.log(data);
    },
    staletime: 60000, // optional
});
```

```html
<button 
    id="load-data"
    type="button"
>
    Load Data
</button>
```