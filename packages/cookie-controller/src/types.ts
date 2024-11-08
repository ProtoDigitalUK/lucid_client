export type Options = {
	onConsentChange?: (data: ConsentChange) => void;
	versioning?: {
		current: string;
		onNewVersion?: (oldVersion: string, newVersion: string) => void;
	};
};

export type ConsentChange = {
	type: "cookie" | "accept" | "reject" | "save" | "onload";
	uuid: string;
	version?: string;

	cookie?: {
		key: string;
		value: boolean;
	};
	cookies: Record<string, boolean>;
};

export type CookieState = {
	uuid: string;
	version?: string;
	interacted: boolean;
	cookies: Record<string, boolean>;
};

export type Elements = {
	details: Element | null;
	alert: Element | null;
	cookieCheckboxes: NodeListOf<HTMLInputElement>;
	actionDismiss: NodeListOf<Element>;
	actionAccept: NodeListOf<Element>;
	actionReject: NodeListOf<Element>;
	actionDetails: NodeListOf<Element>;
	actionSave: NodeListOf<Element>;
};
