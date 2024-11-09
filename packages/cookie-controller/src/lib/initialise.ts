import type { Options } from "../types.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Initialises the library
 */
const initialise = (initOptions?: Partial<Options>) => {
	S.options = {
		essentialCookies: initOptions?.essentialCookies ?? false,
		categoryCookies: initOptions?.categoryCookies ?? {},
		onConsentChange: initOptions?.onConsentChange ?? null,
		versioning: initOptions?.versioning ?? null,
	};

	S.elements = lib.getElements();
	S.abortController = new AbortController();

	if (!S.elements.details) {
		lib.log("warn", "No details element has been found.");
		return;
	}
	if (!S.elements.alert) {
		lib.log("warn", "No alert element has been found.");
		return;
	}

	S.state = lib.getCookieState();
	lib.setAttributes("static");
	lib.setAttributes("dynamic");

	if (!S.state.interacted) lib.alertState.set(true);

	lib.registerEvents();

	if (S.state.version && S.options.versioning?.current) {
		if (S.state.version !== S.options.versioning.current) {
			S.options.versioning.onNewVersion?.(
				S.state.version,
				S.options.versioning.current,
			);
		}
		S.state.version = S.options.versioning.current;
		lib.setCookieState(S.state);
	}

	lib.onConsentChange("onload");
};

export default initialise;
