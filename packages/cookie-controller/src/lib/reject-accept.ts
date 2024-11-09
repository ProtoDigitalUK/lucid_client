import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Handle rejecting or accepting
 */
const rejectAccept = (mode: "accept" | "reject" = "accept") => {
	if (S.elements?.categoryCheckboxes) {
		for (let i = 0; i < S.elements.categoryCheckboxes.length; i++) {
			const element = S.elements.categoryCheckboxes[i];
			if (!element) continue;
			const key = element.getAttribute(C.attributes.cookieCategory) as string;
			S.state.categories[key] = mode === "accept";
		}
	}

	lib.onConsentChange(mode);
	lib.dismiss();
};

export default rejectAccept;
