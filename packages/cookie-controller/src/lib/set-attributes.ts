import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Handles setting static or dynamic accessibility attributes
 */
const setAttributes = (type: "static" | "dynamic") => {
	if (type === "static") {
		if (!S.elements?.details?.hasAttribute("id"))
			S.elements?.details?.setAttribute("id", C.ids.details);
		if (!S.elements?.alert?.hasAttribute("id"))
			S.elements?.alert?.setAttribute("id", C.ids.alert);

		const detailId = S.elements?.details?.getAttribute("id") as string;

		S.elements?.details?.setAttribute("role", "dialog");
		S.elements?.details?.setAttribute("aria-modal", "true");

		S.elements?.alert?.setAttribute("aria-live", "polite");
		S.elements?.alert?.setAttribute("role", "alert");

		if (S.elements?.actionDetails) {
			for (let i = 0; i < S.elements.actionDetails.length; i++) {
				const element = S.elements.actionDetails[i];
				element?.setAttribute("aria-controls", detailId);
				element?.setAttribute("aria-haspopup", "dialog");
			}
		}
	}

	if (type === "dynamic") {
		const detailsState = lib.detailsState.get();

		S.elements?.details?.setAttribute(
			"aria-hidden",
			detailsState ? "false" : "true",
		);
		S.elements?.alert?.setAttribute(
			"aria-hidden",
			detailsState ? "true" : "false",
		);

		if (S.elements?.actionDetails) {
			for (let i = 0; i < S.elements.actionDetails.length; i++) {
				const element = S.elements.actionDetails[i];
				element?.setAttribute("aria-expanded", detailsState ? "true" : "false");
			}
		}
	}
};

export default setAttributes;
