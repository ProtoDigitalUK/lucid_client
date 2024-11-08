export type Options = {
	/**
	 * Determines when the onConsentChange callback is fired
	 * - save: when the data-cookie-action="save" button is clicked
	 * - change: whena a cookie checkbox is changed
	 */
	mode: "save" | "change";
	/**
	 * Set to true if you have essential cookies. This will return an extra category item called "essential" in the categories array on the onConsentChange callback
	 */
	essentialCookies: boolean;
	/**
	 * A list of cookies that get added when a certain cateogry is consented
	 * - Ie: analytics: ["_ga", "_gid"]
	 *
	 * Note that these are just returned in the onConsentChange callback, they are not added/removed from the users cookies
	 */
	categoryCookies: Record<string | "esential", Array<string>>;
	/**
	 * A callback that is fired whenever the consent state changes
	 */
	onConsentChange: ((data: ConsentChange) => void) | null;
	/**
	 * A callback that is fired whenever a user state has a different version of the cookie policy to the current version
	 */
	versioning: {
		/**
		 * The current version of the cookie policy
		 */
		current: string;
		/**
		 * The callback
		 */
		onNewVersion?: (oldVersion: string, newVersion: string) => void;
	} | null;
};

export type ConsentChange = {
	/**
	 * The consent change type
	 * - change: when a cookie checkbox is changed
	 * - accept: when the accept button is clicked
	 * - reject: when the reject button is clicked
	 * - save: when the save button is clicked
	 * - onload: when the library is initialised
	 */
	type: "change" | "accept" | "reject" | "save" | "onload";
	/**
	 * The users UUID
	 */
	uuid: string;
	/**
	 * The version of the cookie policy
	 */
	version?: string;
	/**
	 * The cookie category that has changed
	 * - only fires when the mode is set to "change"
	 */
	changed?: {
		category: string;
		consented: boolean;
		cookies: Array<string>;
	};
	/**
	 * All of the cookie category states
	 */
	categories: Array<{
		category: string;
		consented: boolean;
		cookies: Array<string>;
	}>;
};

export type CookieState = {
	uuid: string;
	version?: string;
	interacted: boolean;
	categories: Record<string, boolean>;
};

export type Elements = {
	details: Element | null;
	alert: Element | null;
	categoryCheckboxes: NodeListOf<HTMLInputElement>;
	actionDismiss: NodeListOf<Element>;
	actionAccept: NodeListOf<Element>;
	actionReject: NodeListOf<Element>;
	actionDetails: NodeListOf<Element>;
	actionSave: NodeListOf<Element>;
};
