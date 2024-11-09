import lib from "./index.js";

/**
 * Accepts all cookie categories
 * - Fires the onConsentChange accept callback
 * - Closes the cookie details and alert modals
 */
const accept = () => lib.rejectAccept("accept");

export default accept;
