import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Updates the state with the new cookie preferences
 * - Fires the onConsentChange save callback
 */
const save = () => {
	if (S.elements?.categoryCheckboxes) {
		for (let i = 0; i < S.elements.categoryCheckboxes.length; i++) {
			const element = S.elements.categoryCheckboxes[i];
			if (!element) continue;

			const key = element.getAttribute(C.attributes.cookieCategory) as string;
			const value = element.checked;
			S.state.categories[key] = value;
		}
	}

	lib.onConsentChange("save");
	lib.dismiss();
};

export default save;
