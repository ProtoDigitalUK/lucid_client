import S from "../state.js";

/**
 * Returns the consent status of a cookie via the key
 */
const getCookieConsent = (key: string) => S.state.categories[key];

export default getCookieConsent;
