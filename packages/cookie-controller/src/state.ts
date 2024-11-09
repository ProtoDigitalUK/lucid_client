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
		version: null,
		storage: {
			path: "/",
			sameSite: "Strict",
			secure: window.location.protocol === "https:",
		},
	},
	abortController: new AbortController(),
	elements: null,
};

export default S;
