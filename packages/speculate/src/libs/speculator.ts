import type {
	SpeculatorConfig,
	OptimisticPrefetchStrategy,
	IntentResponse,
	TargetElements,
} from "../types.js";
import validConnection from "../utils/valid-connection.js";

class Speculator<T, D> {
	private cache = new Map<
		string,
		{
			timestamp: number;
			promise: IntentResponse<T, D>;
		}
	>();
	private abortController = new AbortController();
	private intentDebounce: {
		target: Element;
		timeout: ReturnType<typeof setTimeout>;
	} | null = null;
	constructor(private config: SpeculatorConfig<T, D>) {
		this.registerEvents();
		this.handleOptimisticPrefetch();
	}
	/**
	 * Registers all required events
	 */
	private registerEvents() {
		for (const target of this.normaliseTargets(this.config.elements)) {
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
		const cacheKey = this.getCacheKey(target);
		if (!cacheKey) return;

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
				}, this.hoverDelay),
			};
		}
	};
	/**
	 * The target click event handler
	 */
	private clickEventHandler = async (e: Event) => {
		const result = await this.prefetch(e.target as Element);
		if (this.config.onClick) this.config.onClick(e, result);
	};
	/**
	 * Gets a cache key for an element
	 */
	private getCacheKey(element: Element): string | null {
		if (this.config.getCacheKey) {
			return this.config.getCacheKey(element) ?? null;
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
	 * Handles optimistic prefetching based on configured strategies
	 */
	private handleOptimisticPrefetch() {
		const sortedStrategies = [...this.optimisticStrategies].sort(
			(a, b) =>
				(a.priority ?? Number.POSITIVE_INFINITY) -
				(b.priority ?? Number.POSITIVE_INFINITY),
		);

		for (const strategy of sortedStrategies) {
			if (strategy.condition && !strategy.condition()) continue;

			const targets = this.normaliseTargets(strategy.elements);
			for (const target of targets) {
				this.schedulePrefetch(target);
			}
		}
	}
	/**
	 * Wraps the fetch callback to ensure consistent error handling
	 */
	private async executeFetchCallback(element: Element) {
		try {
			return await this.config.fetch(element);
		} catch (error) {
			return {
				error: {
					message:
						error instanceof Error
							? error.message
							: "An unknown error was caught while executing the fetch callback.",
					exception: error,
				},
				data: undefined,
			};
		}
	}
	/**
	 * Scheduels the prefetch for when idle
	 */
	private schedulePrefetch(element: Element) {
		const prefetch = () => this.prefetch(element);

		typeof requestIdleCallback !== "undefined"
			? requestIdleCallback(prefetch)
			: setTimeout(prefetch, 0);
	}
	/**
	 * Normalises a TargetElements value
	 */
	private normaliseTargets(elements?: TargetElements) {
		if (!elements) {
			return [];
		}
		if (elements instanceof NodeList) {
			return Array.from(elements);
		}
		if (Array.isArray(elements)) return elements;
		return [elements];
	}
	/**
	 * Cache config w/ defaults
	 */
	private get cacheConfig() {
		return {
			maxSize: this.config.cache?.maxSize ?? 5,
			staleTime: this.config.cache?.staleTime ?? 120000,
		};
	}
	/**
	 * Normalises optimistic strategies
	 */
	private get optimisticStrategies(): OptimisticPrefetchStrategy[] {
		if (!this.config.optimistic) {
			return [];
		}
		return Array.isArray(this.config.optimistic)
			? this.config.optimistic
			: [this.config.optimistic];
	}
	/**
	 * Hover delay w/ config
	 */
	private get hoverDelay() {
		return this.config.hoverDelay ?? 100;
	}

	// ----------------
	// Public API

	/**
	 * Destroys and resets the Speculator instance
	 */
	public destroy() {
		this.abortController.abort();
		this.clearCache();
		if (this.intentDebounce) {
			clearTimeout(this.intentDebounce.timeout);
			this.intentDebounce = null;
		}
	}
	/**
	 * Refreshes the Speculator instance
	 */
	public refresh(
		refreshConfig?: Partial<
			Pick<SpeculatorConfig<T, D>, "elements" | "optimistic">
		>,
	) {
		if (refreshConfig) {
			this.config = {
				...this.config,
				...(refreshConfig.elements && { elements: refreshConfig.elements }),
				...(refreshConfig.optimistic && {
					optimistic: refreshConfig.optimistic,
				}),
			};
		}

		this.destroy();
		this.abortController = new AbortController();
		this.registerEvents();
		this.handleOptimisticPrefetch();
	}
	/**
	 * Prefetch fetch callback for a given element.
	 */
	public async prefetch(element: Element) {
		const cacheKey = this.getCacheKey(element);

		//* return cache if it exists and not stale
		if (cacheKey) {
			const cached = this.cache.get(cacheKey);
			if (cached && !this.isStale(cached.timestamp)) {
				return cached.promise;
			}
		}

		const promise = this.executeFetchCallback(element);

		//* cache and manage cache size
		if (cacheKey) {
			this.manageCacheSize();
			this.cache.set(cacheKey, {
				timestamp: Date.now(),
				promise,
			});
		}

		return promise;
	}
	/**
	 * Prefetch multiple elements at once
	 */
	public async prefetchAll(elements: Element[] | NodeListOf<Element>) {
		const elementArray = Array.from(elements);
		return Promise.all(elementArray.map((element) => this.prefetch(element)));
	}
	/**
	 * Clears a cache entry. If no element is provided, clears entire cache
	 */
	public clearCache(element?: Element): void {
		if (!element) {
			this.cache.clear();
			return;
		}

		const cacheKey = this.getCacheKey(element);
		if (cacheKey) this.cache.delete(cacheKey);
	}
}

export default Speculator;
