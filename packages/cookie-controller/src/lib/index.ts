import getElements from "./get-elements.js";
import generateUUID from "./generate-uuid.js";
import getCookieState from "./get-cookie-state.js";
import log from "./log.js";
import setCookieState from "./set-cookie-state.js";
import setAttributes from "./set-attributes.js";
import alertState from "./alert-state.js";
import detailsState from "./details-state.js";
import onConsentChange from "./on-consent-change.js";
import onCategoryChange from "./on-category-change.js";
import rejectAccept from "./reject-accept.js";
import reject from "./reject.js";
import accept from "./accept.js";
import dismiss from "./dismiss.js";
import toggleDetails from "./toggle-details.js";
import save from "./save.js";
import registerEvents from "./register-events.js";
import initialise from "./initialise.js";
import destroy from "./destroy.js";
import getCookieConsent from "./get-cookie-consentt.js";

const lib = {
	getElements,
	generateUUID,
	getCookieState,
	log,
	setCookieState,
	setAttributes,
	alertState,
	detailsState,
	onConsentChange,
	onCategoryChange,
	rejectAccept,
	accept,
	reject,
	dismiss,
	toggleDetails,
	save,
	registerEvents,
	initialise,
	destroy,
	getCookieConsent,
};

export default lib;
