import type { PrefetchDataConfig } from "../types.js";

export default class PrefetchData<T> {
	config: PrefetchDataConfig<T> | null = null;
	promise: Promise<T> | null = null;
	time: number | null = null;
	abortController = new AbortController();
	constructor(config: PrefetchDataConfig<T>) {
		this.config = config;
		this.initialise();
	}

	// ----------------
	// Private methods
	private initialise() {
		this.getTarget?.addEventListener("click", this.click, {
			signal: this.abortController.signal,
		});
		this.getTarget?.addEventListener("mouseover", this.prefetch, {
			signal: this.abortController.signal,
		});
	}
	private prefetch = (e: MouseEvent) => {
		if (!this.config?.fetch) return;
		if (!this.promise || this.stale) {
			this.promise = this.config.fetch();
			this.time = Date.now();
		}
	};
	private click = (e: MouseEvent) => {
		if (!this.config?.onClick) return;
		if (!this.promise) return;
		this.promise.then(this.config.onClick);
	};

	// ----------------
	// Public methods
	destroy() {
		this.abortController.abort();
		this.abortController = new AbortController();
	}
	// ----------------
	// Getters
	get getTarget() {
		if (this.config) {
			return document.querySelector(this.config.target) as HTMLElement;
		}
		return null;
	}
	get stale() {
		if (!this.time) return false;
		if (!this.config?.staletime) return false;
		return Date.now() - this.time > this.config.staletime;
	}
}
