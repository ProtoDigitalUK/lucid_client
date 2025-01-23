import type { SpeculatorConfig, OptimisticPreloadStrategy } from "../types.js";
import validConnection from "../utils/valid-connection.js";

class Speculator<T> {
	private cache = new Map<
		string,
		{
			timestamp: number;
			promise: Promise<T>;
		}
	>();
	private abortController = new AbortController();
	private intentDebounce: {
		target: Element;
		timeout: ReturnType<typeof setTimeout>;
	} | null = null;
	constructor(private config: SpeculatorConfig<T>) {
		this.registerEvents();
		this.handleOptimisticPreload();
	}
	/**
	 * Registers all required events
	 */
	private registerEvents() {
		for (const target of this.targets) {
			target.addEventListener("mouseover", this.mouseOverEventHandler, {
				signal: this.abortController.signal,
			});
			target.addEventListener("click", this.clickEventHandler, {
				signal: this.abortController.signal,
			});
		}
	}
	/**
	 * The target mouseover event handler
	 */
	private mouseOverEventHandler = (e: Event) => {
		if (!validConnection()) return;
		const target = e.target as Element;

		if (this.intentDebounce && this.intentDebounce.target !== target) {
			clearTimeout(this.intentDebounce.timeout);
			this.intentDebounce = null;
		}

		if (!this.intentDebounce) {
			this.intentDebounce = {
				target,
				timeout: setTimeout(() => {
					this.prefetch(target);
					this.intentDebounce = null;
				}, this.config.intentDebounceTimeout ?? 100),
			};
		}
	};
	/**
	 * The target click event handler
	 */
	private clickEventHandler = async (e: Event) => {
		const target = e.target as Element;
		const data = await this.prefetch(target);

		if (this.config.onClick && data) {
			this.config.onClick(data, target);
		}
	};
	/**
	 * Prefetch on intent
	 */
	private async prefetch(element: Element): Promise<T | undefined> {
		try {
			const cacheKey = this.getCacheKey(element);

			//* return cache if it exists and not stale
			if (cacheKey) {
				const cached = this.cache.get(cacheKey);
				if (cached && !this.isStale(cached.timestamp)) {
					return cached.promise;
				}
			}

			const promise = this.config.onIntent(element);

			//* cache and manage cache size
			if (cacheKey) {
				this.manageCacheSize();
				this.cache.set(cacheKey, {
					timestamp: Date.now(),
					promise,
				});
			}

			return promise;
		} catch (error) {
			console.error(
				error instanceof Error
					? error.message
					: "An unknown error occured while prefetching the onIntent callback.",
			);
			return undefined;
		}
	}
	/**
	 * Gets a cache key for an element
	 */
	private getCacheKey(element: Element): string | null {
		if (this.config.getCacheKey) {
			return this.config.getCacheKey(element);
		}
		return element.id || null;
	}
	/**
	 * Checks if a cached item is stale
	 */
	private isStale(timestamp: number): boolean {
		return Date.now() - timestamp > this.cacheConfig.staleTime;
	}
	/**
	 * Manages the cache size by removing oldest entries when limit is reached
	 */
	private manageCacheSize() {
		while (this.cache.size >= this.cacheConfig.maxSize) {
			let oldestKey: string | null = null;
			let oldestTimestamp = Number.POSITIVE_INFINITY;

			for (const [key, value] of this.cache.entries()) {
				if (value.timestamp < oldestTimestamp) {
					oldestTimestamp = value.timestamp;
					oldestKey = key;
				}
			}

			if (oldestKey) {
				this.cache.delete(oldestKey);
			}
		}
	}
	/**
	 * Gets elements from an optimistic strategy
	 */
	private getOptimisticElements(
		strategy: OptimisticPreloadStrategy,
	): Element[] {
		if (strategy.immediate instanceof NodeList) {
			return Array.from(strategy.immediate);
		}
		return [strategy.immediate];
	}
	/**
	 * Handles optimistic preloading based on configured strategies
	 */
	private handleOptimisticPreload() {
		const sortedStrategies = [...this.optimisticStrategies].sort(
			(a, b) =>
				(a.priority ?? Number.POSITIVE_INFINITY) -
				(b.priority ?? Number.POSITIVE_INFINITY),
		);

		for (const strategy of sortedStrategies) {
			if (strategy.condition && !strategy.condition()) continue;

			const targets = this.getOptimisticElements(strategy);
			for (const target of targets) {
				Promise.resolve().then(() => this.prefetch(target));
			}
		}
	}
	/**
	 * Destroys and resets the Speculator instance
	 */
	public destroy() {
		this.abortController.abort();
		if (this.intentDebounce?.timeout) clearTimeout(this.intentDebounce.timeout);
		this.cache.clear();
	}
	/**
	 * Programmatically trigger prefetch for a target element
	 */
	public prefetchTarget(element: Element): Promise<T | undefined> {
		return this.prefetch(element);
	}
	// ----------------
	// Gettters
	private get cacheConfig() {
		return {
			maxSize: this.config.cache?.maxSize ?? 5,
			staleTime: this.config.cache?.staleTime ?? 120000,
		};
	}
	private get targets(): Element[] {
		if (!this.config.targets) {
			return [];
		}
		if (this.config.targets instanceof NodeList) {
			return Array.from(this.config.targets);
		}
		return [this.config.targets];
	}
	private get optimisticStrategies(): OptimisticPreloadStrategy[] {
		if (!this.config.optimistic) {
			return [];
		}
		return Array.isArray(this.config.optimistic)
			? this.config.optimistic
			: [this.config.optimistic];
	}
}

export default Speculator;
