import lib from "./index.js";

/**
 * Rejects all cookie categories
 * - Fires the onConsentChange reject callback
 * - Closes the cookie details and alert modals
 */
const reject = () => lib.rejectAccept("reject");

export default reject;
