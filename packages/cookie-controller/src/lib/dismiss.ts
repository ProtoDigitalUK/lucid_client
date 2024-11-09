import S from "../state.js";
import lib from "./index.js";

/**
 * Closes the cookie details and alert modals
 */
const dismiss = () => {
	lib.detailsState.set(false);
	lib.alertState.set(false);

	S.state.interacted = true;
	lib.setCookieState(S.state);
};

export default dismiss;
