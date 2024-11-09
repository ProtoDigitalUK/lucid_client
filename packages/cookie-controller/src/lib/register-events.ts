import S from "../state.js";
import lib from "./index.js";

/**
 * Register the required event listeners
 */
const registerEvents = () => {
	const { signal } = S.abortController;

	const registerEventListener = (
		elements: NodeListOf<Element | HTMLInputElement>,
		event: string,
		fn: (e: Event) => void,
	) => {
		for (let i = 0; i < elements.length; i++) {
			elements[i]?.addEventListener(event, fn, { signal });
		}
	};

	if (S.elements?.actionDismiss)
		registerEventListener(S.elements.actionDismiss, "click", lib.dismiss);
	if (S.elements?.actionAccept)
		registerEventListener(S.elements.actionAccept, "click", lib.accept);
	if (S.elements?.actionReject)
		registerEventListener(S.elements.actionReject, "click", lib.reject);
	if (S.elements?.actionDetails)
		registerEventListener(S.elements.actionDetails, "click", lib.toggleDetails);
	if (S.elements?.actionSave)
		registerEventListener(S.elements.actionSave, "click", lib.save);
	if (S.elements?.categoryCheckboxes)
		registerEventListener(
			S.elements.categoryCheckboxes,
			"change",
			lib.onCategoryChange,
		);
};

export default registerEvents;
