import C from "./constants.js";
import type { Options, ConsentChange, CookieState, Elements } from "./types.js";

export default class CookieController {
	options: Options;
	state: CookieState = {
		uuid: "",
		interacted: false,
		categories: {},
	};
	abortController = new AbortController();
	elements: Elements = {
		details: this.details,
		alert: this.alert,
		categoryCheckboxes: this.categoryCheckboxes,
		actionDismiss: this.actionDismiss,
		actionAccept: this.actionAccept,
		actionReject: this.actionReject,
		actionDetails: this.actionDetails,
		actionSave: this.actionSave,
	};
	constructor(options?: Partial<Options>) {
		this.options = {
			mode: options?.mode ?? "save",
			onConsentChange: options?.onConsentChange ?? null,
			versioning: options?.versioning ?? null,
		};

		if (!this.elements.details) {
			this.log("warn", "No details element has been found.");
			return;
		}
		if (!this.elements.alert) {
			this.log("warn", "No alert element has been found.");
			return;
		}

		this.initialise();
	}
	/**
	 * Initialises the library
	 */
	private initialise() {
		this.state = this.cookieState;
		this.setAttributes("static");
		this.setAttributes("dynamic");

		if (!this.state.interacted) this.alertState = true;

		//* register events
		this.regEventListenerLoop(
			this.elements.actionDismiss,
			"click",
			(e: Event) => this.dismiss(),
		);
		this.regEventListenerLoop(this.elements.actionAccept, "click", (e: Event) =>
			this.accept(),
		);
		this.regEventListenerLoop(this.elements.actionReject, "click", (e: Event) =>
			this.reject(),
		);
		this.regEventListenerLoop(
			this.elements.actionDetails,
			"click",
			(e: Event) => this.toggleDetails(),
		);
		this.regEventListenerLoop(this.elements.actionSave, "click", (e: Event) =>
			this.save(),
		);
		this.regEventListenerLoop(
			this.elements.categoryCheckboxes,
			"change",
			(e: Event) => this.onCategoryChange(e),
		);

		//* if there is a versioning option, check if the version is different from the current version
		if (this.state.version && this.options.versioning?.current) {
			if (this.state.version !== this.options.versioning.current) {
				this.options.versioning.onNewVersion?.(
					this.state.version,
					this.options.versioning.current,
				);
			}
			this.state.version = this.options.versioning.current;
			this.cookieState = this.state;
		}

		this.onConsentChange("onload");
	}
	/**
	 * Handles setting static or dynamic accessibility attributes
	 */
	private setAttributes(type: "static" | "dynamic") {
		if (type === "static") {
			if (!this.elements.details?.hasAttribute("id"))
				this.elements.details?.setAttribute("id", C.ids.details);
			if (!this.elements.alert?.hasAttribute("id"))
				this.elements.alert?.setAttribute("id", C.ids.alert);

			const detailId = this.elements.details?.getAttribute("id") as string;

			this.elements.details?.setAttribute("role", "dialog");
			this.elements.details?.setAttribute("aria-modal", "true");

			this.elements.alert?.setAttribute("aria-live", "polite");
			this.elements.alert?.setAttribute("role", "alert");

			for (let i = 0; i < this.elements.actionDetails.length; i++) {
				const element = this.elements.actionDetails[i];
				element?.setAttribute("aria-controls", detailId);
				element?.setAttribute("aria-haspopup", "dialog");
			}
		}
		if (type === "dynamic") {
			const detailsState = this.detailsState;

			this.elements.details?.setAttribute(
				"aria-hidden",
				detailsState ? "false" : "true",
			);
			this.elements.alert?.setAttribute(
				"aria-hidden",
				detailsState ? "true" : "false",
			);

			for (let i = 0; i < this.elements.actionDetails.length; i++) {
				const element = this.elements.actionDetails[i];
				element?.setAttribute("aria-expanded", detailsState ? "true" : "false");
			}
		}
	}
	/**
	 * The on change event of cookie category checkboxes
	 */
	private onCategoryChange(e: Event) {
		if (this.options.mode !== "change") return;

		const target = e.target as HTMLInputElement;

		const category = target.getAttribute(C.attributes.cookieCategory) as string;
		if (!category) return;

		const consented = target.checked;

		this.state.categories[category] = consented;
		this.cookieState = this.state;

		this.onConsentChange("change", {
			category,
			consented,
			cookies: [], //TODO: update
		});
	}
	/**
	 * A util fires the onConsentChange callback
	 */
	private onConsentChange(
		type: ConsentChange["type"],
		category?: {
			category: string;
			consented: boolean;
			cookies: Array<string>;
		},
	) {
		if (this.options.onConsentChange) {
			this.options.onConsentChange({
				type,
				uuid: this.state.uuid,
				version: this.state.version,
				categories: Object.entries(this.state.categories).map(
					([category, consented]) => ({
						category,
						consented,
						cookies: [], // TODO: update
					}),
				),
				changed: category,
			});
		}
	}
	/**
	 * A util to register event listeners
	 */
	private regEventListenerLoop(
		elements: NodeListOf<Element | HTMLInputElement>,
		event: string,
		fn: (e: Event) => void,
	) {
		const { signal } = this.abortController;

		for (let i = 0; i < elements.length; i++) {
			elements[i]?.addEventListener(event, fn, { signal });
		}
	}
	/**
	 * A util to generate a UUID
	 */
	private generateUUID() {
		if (typeof crypto !== "undefined" && crypto.randomUUID) {
			return crypto.randomUUID();
		}

		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
	/**
	 * Handle rejecting or accepting
	 */
	private rejectAccept(mode: "accept" | "reject" = "accept") {
		for (let i = 0; i < this.elements.categoryCheckboxes.length; i++) {
			const element = this.elements.categoryCheckboxes[i];
			if (!element) continue;
			const key = element.getAttribute(C.attributes.cookieCategory) as string;
			this.state.categories[key] = mode === "accept";
		}

		this.onConsentChange(mode);
		this.dismiss();
	}
	/**
	 * A util for logging
	 */
	private log(type: "warn", msg: string) {
		if (type === "warn") console.warn(`[Cookie Controller] ${msg}`);
	}

	/**
	 * Destroys the cookie controller instance and removes all event listeners
	 */
	destroy() {
		this.abortController.abort();
	}
	/**
	 * Accepts all cookie categories
	 * - Fires the onConsentChange accept callback
	 * - Closes the cookie details and alert modals
	 */
	accept() {
		this.rejectAccept("accept");
	}
	/**
	 * Rejects all cookie categories
	 * - Fires the onConsentChange reject callback
	 * - Closes the cookie details and alert modals
	 */
	reject() {
		this.rejectAccept("reject");
	}
	/**
	 * Closes the cookie details and alert modals
	 */
	dismiss() {
		this.detailsState = false;
		this.alertState = false;

		this.state.interacted = true;
		this.cookieState = this.state;
	}
	/**
	 * Toggles the details modal
	 */
	toggleDetails() {
		for (let i = 0; i < this.elements.categoryCheckboxes.length; i++) {
			const element = this.elements.categoryCheckboxes[i];
			if (!element) continue;

			const key = element.getAttribute(C.attributes.cookieCategory) as string;
			const value = this.state.categories[key];
			element.checked = value ?? false;
		}

		this.detailsState = !this.detailsState;
		this.state.interacted = true;
		this.cookieState = this.state;
	}
	/**
	 * Updates the state with the new cookie preferences
	 * - Fires the onConsentChange save callback
	 */
	save() {
		for (let i = 0; i < this.elements.categoryCheckboxes.length; i++) {
			const element = this.elements.categoryCheckboxes[i];
			if (!element) continue;

			const key = element.getAttribute(C.attributes.cookieCategory) as string;
			const value = element.checked;
			this.state.categories[key] = value;
		}

		this.onConsentChange("save");
		this.dismiss();
	}
	/**
	 * Returns the consent status of a cookie via the key
	 */
	getCookieConsent(key: string) {
		return this.state.categories[key];
	}

	/**
	 * Sets the alert modal state - open/close
	 */
	private set alertState(state: boolean) {
		this.elements.alert?.setAttribute(
			C.attributes.alert,
			state ? "true" : "false",
		);
		this.setAttributes("dynamic");
	}
	/**
	 * Sets the details modal state - open/close
	 */
	private set detailsState(state: boolean) {
		if (this.alertState) this.alertState = false;
		this.elements.details?.setAttribute(
			C.attributes.details,
			state ? "true" : "false",
		);
		this.setAttributes("dynamic");
	}
	/**
	 * Sets the cookie state via document.cookie
	 * - creates new uuid if not present
	 */
	private set cookieState(state: CookieState) {
		if (!state.uuid) state.uuid = this.generateUUID();

		const cookieValue = JSON.stringify(state);
		document.cookie = `${C.key}=${cookieValue};path=/;SameSite=Strict`;

		this.state = state;
	}
	/**
	 * Returns the alert modal state - open/close
	 */
	get alertState() {
		return this.elements.alert?.getAttribute(C.attributes.alert) === "true";
	}
	/**
	 * Returns the details modal state - open/close
	 */
	get detailsState() {
		return this.elements.details?.getAttribute(C.attributes.details) === "true";
	}
	/**
	 * Returns the cookie state
	 * - Either creates new state or returns existing state
	 */
	get cookieState() {
		const defaultCategories: Record<string, boolean> = {};
		for (let i = 0; i < this.elements.categoryCheckboxes.length; i++) {
			const element = this.elements.categoryCheckboxes[i];
			const key = element?.getAttribute(C.attributes.cookieCategory) as string;
			defaultCategories[key] = false;
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
				version: this.options.versioning?.current || undefined,
				interacted: false,
				categories: defaultCategories,
			};
		} catch (error) {
			return {
				uuid: "",
				version: this.options.versioning?.current || undefined,
				interacted: false,
				categories: defaultCategories,
			};
		}
	}

	/**
	 * Returns the details modal element
	 */
	get details() {
		return document.querySelector(`[${C.attributes.details}]`);
	}
	/**
	 * Returns the alert modal element
	 */
	get alert() {
		return document.querySelector(`[${C.attributes.alert}]`);
	}
	/**
	 * Returns the cookie category elements
	 */
	get categoryCheckboxes() {
		return document.querySelectorAll(
			`input[type="checkbox"][${C.attributes.cookieCategory}]`,
		) as NodeListOf<HTMLInputElement>;
	}
	/**
	 * Returns the dismiss button elements
	 */
	get actionDismiss() {
		return document.querySelectorAll(
			`[${C.attributes.action.attribute}="${C.attributes.action.value.dismiss}"]`,
		);
	}
	/**
	 * Returns the accept button elements
	 */
	get actionAccept() {
		return document.querySelectorAll(
			`[${C.attributes.action.attribute}="${C.attributes.action.value.accept}"]`,
		);
	}
	/**
	 * Returns the reject button elements
	 */
	get actionReject() {
		return document.querySelectorAll(
			`[${C.attributes.action.attribute}="${C.attributes.action.value.reject}"]`,
		);
	}
	/**
	 * Returns the details button elements
	 */
	get actionDetails() {
		return document.querySelectorAll(
			`[${C.attributes.action.attribute}="${C.attributes.action.value.details}"]`,
		);
	}
	/**
	 * Returns the save button elements
	 */
	get actionSave() {
		return document.querySelectorAll(
			`[${C.attributes.action.attribute}="${C.attributes.action.value.save}"]`,
		);
	}
}
