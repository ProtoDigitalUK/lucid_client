export type Options = {
	/**
	 * Determines when the onConsentChange callback is fired
	 * - save: when the data-cookie-action="save" button is clicked
	 * - change: whena a cookie checkbox is changed
	 */
	mode: "save" | "change";
	onConsentChange: ((data: ConsentChange) => void) | null;
	versioning: {
		current: string;
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
