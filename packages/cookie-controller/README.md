# Cookie Controller

> Part of the Lucid Client suite

The Lucid Cookie Controller is a lightweight JavaScript library that enables you to easily implement a cookie consent solution on your website. It offers a range of features that enable you to support GDPR compliance.

Similar to other Lucid libraries, there is a focus of config in HTML and the library avoids inserting any HTML into the DOM and requires no CSS. This means you can easily customise the look and feel of the cookie controller to match your website's design.

## Features

- **Attribute Driven:** Implement using your own HTML and CSS, with the library handling the logic and functionality.
- **Granular Callbacks:** Execute custom functions on consent acceptance or rejection.
- **Modes:** Choose between saving cookie preferences on checkbox change, or on save. This is controlled by the `data-cookie-action="save"` attribute - if not present, cookie prefferences will be saved on checkbox change.
- **Versioning:** Define a version number for your cookie policy, enabling you to update the policy and reset user preferences.
- **Consent Recording:** Generate a unique identifier for each consent instance, enabling a record of user preferences without storing personal data.
- **Accessibility:** The library is fully accessible and as its attribute driven, you can easily customise the HTML to further meet your accessibility requirements.
- **Destroy:** Destroy the cookie controller instance and remove all event listeners. Useful for using within SPA's.

## Examples

- [Basic](https://github.com/ProtoDigitalUK/lucid_primitives/tree/master/packages/cookie-controller/examples/basic.html)
- [Tailwind](https://github.com/ProtoDigitalUK/lucid_primitives/tree/master/packages/cookie-controller/examples/tailwind.html)

## Getting Started

### Installation

To install the Lucid Cookie Controller library, run the following command:

```bash
npm install @lucidclient/cookie-controller
```

### Usage

To use the Lucid Cookie Controller library, import the `CookieController` class from the library and instantiate.

```typescript
import CookieController from "@lucidclient/cookie-controller";

new CookieController({
  onConsentChange: (data) => {
    console.log(data);
  },
  versioning: {
    current: "1.0.0",
    onNewVersion: (oldVersion, newVersion) => {
      console.log(oldVersion, newVersion);
    },
  },
});
```

> All config is optional, though you will need to supply a onConsentChange callback and save the data to ensure compliance with the consent recording requirements of GDPR.

```html
<div data-cookie-details>
  <button data-cookie-action="dismiss">Close</button>
  <button data-cookie-action="accept">Accept Recommended</button>
  <button data-cookie-action="reject">Reject</button>
  <a href="https://www.example.com/privacy-policy" target="_blank">
    Cookie Policy
  </a>
  <ul>
    <li>
      <input id="analytics" type="checkbox" data-cookie-config="analytics" />
      <label for="analytics">Analytics</label>
    </li>
    <li>
      <input id="marketing" type="checkbox" data-cookie-config="marketing" />
      <label for="marketing">Marketing</label>
    </li>
  </ul>

  <!-- If not present, cookie prefferences will be saved on checkbox change -->
  <button data-cookie-action="save">Save My Preferences</button>
</div>

<div data-cookie-alert>
  <button data-cookie-action="accept">Accept All</button>
  <button data-cookie-action="reject">Reject</button>
  <button data-cookie-action="details">Details</button>
  <button data-cookie-action="dismiss">Close</button>
</div>

<button data-cookie-action="details">Open Cookie Modal</button>
```

> For a more detailed example, checkout the tailwind.html example.

### Methods

#### `destroy()`

Destroy the cookie controller instance and remove all event listeners. Useful for using within SPA's.

#### `getCookieConsent(key)`

Returns the current consent status of a cookie key (true/false).

## GDPR Compliance Tips

Our cookie controller is developed with GDPR considerations in mind, supporting adherence to GDPR principles. While this tool offers functionalities aligning with GDPR requirements, full compliance depends on how it is implemented within your website's broader context and architecture.

Here are some tips for achieving compliance:

- **Cookie Policy Link:** Include a link to your cookie or privacy policy.
- **Define Cookie Controls:** Clearly define what each checkbox controls, providing details like the name, duration, and purpose of the cookies.
- **Necessary Cookies:** Inform users about necessary cookies. These should not be connected to a `data-cookie-config` attribute, as they are for informational purposes only.
- **Equal Prominence:** Ensure 'Accept' and 'Reject' options are equally prominent in your design.
- **Accessibility:** Make sure the cookie controller is accessible to all users.
- **Consent Recording:** Save the consent data to ensure compliance with the consent recording requirements of GDPR.

Please note this is not an exhaustive list, and we recommend seeking legal advice to ensure full compliance.
