import S from "../state.js";
import C from "../constants.js";
import type { CookieState } from "../types.js";

/**
 * Get the state via the user's cookie
 */
const getCookieState = () => {
	const defaultCategories: Record<string, boolean> = {};
	if (S.elements?.categoryCheckboxes) {
		for (let i = 0; i < S.elements.categoryCheckboxes.length; i++) {
			const element = S.elements.categoryCheckboxes[i];
			const key = element?.getAttribute(C.attributes.cookieCategory) as string;
			defaultCategories[key] = false;
		}
	}

	try {
		const cookie = document.cookie
			.split(";")
			.find((cookie) => cookie.trim().startsWith(`${C.key}=`));
		const value = cookie?.split("=")[1];

		if (value) {
			return JSON.parse(value) as CookieState;
		}

		return {
			uuid: "",
			version: S.options.version?.current || undefined,
			interacted: false,
			categories: defaultCategories,
		};
	} catch (error) {
		return {
			uuid: "",
			version: S.options.version?.current || undefined,
			interacted: false,
			categories: defaultCategories,
		};
	}
};

export default getCookieState;
