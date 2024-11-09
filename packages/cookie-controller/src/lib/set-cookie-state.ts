import C from "../constants.js";
import S from "../state.js";
import type { CookieState } from "../types.js";
import lib from "./index.js";

/**
 * Sets the state via the user's cookie
 */
const setCookieState = (newState: CookieState) => {
	if (!newState.uuid) newState.uuid = lib.generateUUID();

	const cookieValue = JSON.stringify(newState);
	document.cookie = lib.formatCookieString(
		C.key,
		cookieValue,
		S.options.storage,
	);

	S.state = newState;
};

export default setCookieState;
