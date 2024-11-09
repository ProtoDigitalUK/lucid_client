import type { Options, CookieState, Elements } from "./types.js";

const S: {
	state: CookieState;
	options: Options;
	abortController: AbortController;
	elements: Elements | null;
} = {
	state: {
		uuid: "",
		interacted: false,
		categories: {},
	},
	options: {
		essentialCookies: false,
		categoryCookies: {},
		onConsentChange: null,
		versioning: null,
	},
	abortController: new AbortController(),
	elements: null,
};

export default S;
