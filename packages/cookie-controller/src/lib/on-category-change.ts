import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * The on change event of cookie category checkboxes
 */
const onCategoryChange = (e: Event) => {
	const target = e.target as HTMLInputElement;

	const category = target.getAttribute(C.attributes.cookieCategory) as string;
	if (!category) return;

	const consented = target.checked;

	S.state.categories[category] = consented;
	lib.setCookieState(S.state);

	lib.onConsentChange("change", {
		category,
		consented,
		cookies: S.options.categoryCookies[category] ?? [],
	});
};

export default onCategoryChange;
