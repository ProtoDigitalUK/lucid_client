import C from "./constants.js";
import type { Options, ConsentChange, CookieState } from "./types.js";

export default class CookieController {
	userOptions: Options = {};
	state: CookieState = {
		uuid: "",
		interacted: false,
		cookies: {},
	};
	constructor(options?: Options) {
		if (options) this.userOptions = options;
		this.initialise();
	}

	private initialise() {
		this.state = this.cookieState;
		this.registerEvents();
		this.setStaticAttributes();
		this.setDynamicAttributes();

		if (!this.state.interacted) this.alertState = true;

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
	private registerEvents() {
		this.accept = this.accept.bind(this);
		this.dismiss = this.dismiss.bind(this);
		this.reject = this.reject.bind(this);
		this.toggleDetails = this.toggleDetails.bind(this);
		this.save = this.save.bind(this);
		this.onCookieChange = this.onCookieChange.bind(this);

		this.regEventListenerLoop(this.actionDismiss, true, "click", this.dismiss);
		this.regEventListenerLoop(this.actionAccept, true, "click", this.accept);
		this.regEventListenerLoop(this.actionReject, true, "click", this.reject);
		this.regEventListenerLoop(
			this.actionDetails,
			true,
			"click",
			this.toggleDetails,
		);
		this.regEventListenerLoop(this.actionSave, true, "click", this.save);
		this.regEventListenerLoop(
			this.cookieConfig,
			true,
			"change",
			this.onCookieChange,
		);
	}
	private setDynamicAttributes() {
		const detailsState = this.detailsState;

		this.details?.setAttribute("aria-hidden", detailsState ? "false" : "true");
		this.alert?.setAttribute("aria-hidden", detailsState ? "true" : "false");

		for (let i = 0; i < this.actionDetails.length; i++) {
			const element = this.actionDetails[i];
			element?.setAttribute("aria-expanded", detailsState ? "true" : "false");
		}
	}
	private setStaticAttributes() {
		if (!this.details?.hasAttribute("id"))
			this.details?.setAttribute("id", C.ids.details);
		if (!this.alert?.hasAttribute("id"))
			this.alert?.setAttribute("id", C.ids.alert);

		const detailId = this.details?.getAttribute("id") as string;

		this.details?.setAttribute("role", "dialog");
		this.details?.setAttribute("aria-modal", "true");

		this.alert?.setAttribute("aria-live", "polite");
		this.alert?.setAttribute("role", "alert");

		for (let i = 0; i < this.actionDetails.length; i++) {
			const element = this.actionDetails[i];
			element?.setAttribute("aria-controls", detailId);
			element?.setAttribute("aria-haspopup", "dialog");
		}
	}
	private getCookieHelper(key: string) {
		const cookie = document.cookie
			.split(";")
			.find((cookie) => cookie.trim().startsWith(`${key}=`));

		if (cookie) {
			const cookieValue = cookie.split("=")[1];
			return cookieValue;
		}
	}
	private onCookieChange(e: Event) {
		if (this.options.mode !== "onChange") return;

		const target = e.target as HTMLInputElement;

		const key = target.getAttribute(C.attributes.cookieConfig) as string;
		if (!key) return;

		const value = target.checked;

		this.state.cookies[key] = value;
		this.cookieState = this.state;

		this.onConsentChange("cookie", {
			key,
			value,
		});
	}
	private onConsentChange(
		type: ConsentChange["type"],
		cookie?: {
			key: string;
			value: boolean;
		},
	) {
		if (this.options.onConsentChange) {
			this.options.onConsentChange({
				type,
				uuid: this.state.uuid,
				version: this.state.version,
				cookies: this.state.cookies,
				cookie,
			});
		}
	}
	private regEventListenerLoop(
		elements: NodeListOf<Element | HTMLInputElement>,
		register: boolean,
		event: string,
		fn: (e: Event) => void,
	) {
		for (let i = 0; i < elements.length; i++) {
			if (register) elements[i]?.addEventListener(event, fn);
			else elements[i]?.removeEventListener(event, fn);
		}
	}
	private generateUUID() {
		const timestamp = Date.now();
		const randomNum = Math.floor(Math.random() * 1000000);
		return `${timestamp}-${randomNum}`;
	}

	private rejectAccept(mode: "accept" | "reject" = "accept") {
		for (let i = 0; i < this.cookieConfig.length; i++) {
			const element = this.cookieConfig[i];
			if (!element) continue;
			const key = element.getAttribute(C.attributes.cookieConfig) as string;
			this.state.cookies[key] = mode === "accept";
		}

		this.onConsentChange(mode);
		this.dismiss();
	}

	/**
	 * Destroys the cookie controller instance and removes all event listeners
	 */
	destroy() {
		this.regEventListenerLoop(this.actionDismiss, false, "click", this.dismiss);
		this.regEventListenerLoop(this.actionAccept, false, "click", this.accept);
		this.regEventListenerLoop(this.actionReject, false, "click", this.reject);
		this.regEventListenerLoop(
			this.actionDetails,
			false,
			"click",
			this.toggleDetails,
		);
		this.regEventListenerLoop(this.actionSave, false, "click", this.save);
		this.regEventListenerLoop(
			this.cookieConfig,
			false,
			"change",
			this.onCookieChange,
		);
	}
	/**
	 * Accepts all cookies
	 * - Fires the onConsentChange accept callback
	 * - Closes the cookie details and alert modals
	 */
	accept() {
		this.rejectAccept("accept");
	}
	/**
	 * Rejects all cookies
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
		for (let i = 0; i < this.cookieConfig.length; i++) {
			const element = this.cookieConfig[i];
			if (!element) continue;

			const key = element.getAttribute(C.attributes.cookieConfig) as string;
			const value = this.state.cookies[key];
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
		for (let i = 0; i < this.cookieConfig.length; i++) {
			const element = this.cookieConfig[i];
			if (!element) continue;

			const key = element.getAttribute(C.attributes.cookieConfig) as string;
			const value = element.checked;
			this.state.cookies[key] = value;
		}

		this.onConsentChange("save");
		this.dismiss();
	}
	/**
	 * Returns the consent status of a cookie via the key
	 */
	getCookieConsent(key: string) {
		return this.state.cookies[key];
	}

	/**
	 * Sets the alert modal state - open/close
	 */
	set alertState(state: boolean) {
		this.alert?.setAttribute(C.attributes.alert, state ? "true" : "false");
		this.setDynamicAttributes();
	}
	/**
	 * Sets the details modal state - open/close
	 */
	set detailsState(state: boolean) {
		if (this.alertState) this.alertState = false;
		this.details?.setAttribute(C.attributes.details, state ? "true" : "false");
		this.setDynamicAttributes();
	}
	/**
	 * Sets the cookie state via document.cookie
	 * - creates new uuid if not present
	 */
	set cookieState(state: CookieState) {
		if (!state.uuid) state.uuid = this.generateUUID();

		const cookieValue = JSON.stringify(state);
		document.cookie = `${C.key}=${cookieValue};path=/;SameSite=Strict`;

		this.state = state;
	}

	/**
	 * Returns the options object
	 */
	get options() {
		return {
			mode: this.actionSave.length > 0 ? "onSave" : "onChange",
			onConsentChange: this.userOptions.onConsentChange || null,
			versioning: this.userOptions.versioning || null,
		};
	}
	/**
	 * Returns the alert modal state - open/close
	 */
	get alertState() {
		return this.alert?.getAttribute(C.attributes.alert) === "true";
	}
	/**
	 * Returns the details modal state - open/close
	 */
	get detailsState() {
		return this.details?.getAttribute(C.attributes.details) === "true";
	}
	/**
	 * Returns the cookie state
	 * - Either creates new state or returns existing state
	 */
	get cookieState() {
		const defaultCookies: Record<string, boolean> = {};
		for (let i = 0; i < this.cookieConfig.length; i++) {
			const element = this.cookieConfig[i];
			const key = element?.getAttribute(C.attributes.cookieConfig) as string;
			defaultCookies[key] = false;
		}

		try {
			const value = this.getCookieHelper(C.key);
			if (value) {
				return JSON.parse(value) as CookieState;
			}
			return {
				uuid: "",
				version: this.options.versioning?.current || undefined,
				interacted: false,
				cookies: defaultCookies,
			};
		} catch (error) {
			return {
				uuid: "",
				version: this.options.versioning?.current || undefined,
				interacted: false,
				cookies: defaultCookies,
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
	 * Returns the cookie config elements
	 */
	get cookieConfig() {
		return document.querySelectorAll(
			`input[type="checkbox"][${C.attributes.cookieConfig}]`,
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
