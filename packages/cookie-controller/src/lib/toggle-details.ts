import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Toggles the details modal
 */
const toggleDetails = () => {
	if (S.elements?.categoryCheckboxes) {
		for (let i = 0; i < S.elements.categoryCheckboxes.length; i++) {
			const element = S.elements.categoryCheckboxes[i];
			if (!element) continue;

			const key = element.getAttribute(C.attributes.cookieCategory) as string;
			const value = S.state.categories[key];
			element.checked = value ?? false;
		}
	}

	lib.detailsState.set(!lib.detailsState.get());
	S.state.interacted = true;
	lib.setCookieState(S.state);
};

export default toggleDetails;
