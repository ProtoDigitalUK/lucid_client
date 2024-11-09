import lib from "./lib/index.js";

export default {
	init: lib.initialise,
	destroy: lib.destroy,
	getCookieConsent: lib.getCookieConsent,
	accept: lib.accept,
	reject: lib.reject,
	dismiss: lib.dismiss,
	toggleDetails: lib.toggleDetails,
	save: lib.save,
};
