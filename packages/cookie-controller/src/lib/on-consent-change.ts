import type { ConsentChange } from "../types.js";
import S from "../state.js";

/**
 * A util fires the onConsentChange callback
 */
const onConsentChange = (
	type: ConsentChange["type"],
	category?: {
		category: string;
		consented: boolean;
		cookies: Array<string>;
	},
) => {
	if (S.options.onConsentChange) {
		const categories = Object.entries(S.state.categories).map(
			([category, consented]) => ({
				category,
				consented,
				cookies: S.options.categoryCookies[category] ?? [],
			}),
		);
		if (S.options.essentialCookies) {
			categories.push({
				category: "essential",
				consented: true,
				cookies: S.options.categoryCookies.essential ?? [],
			});
		}

		S.options.onConsentChange({
			type,
			uuid: S.state.uuid,
			version: S.state.version,
			categories: categories,
			changed: category,
		});
	}
};

export default onConsentChange;
