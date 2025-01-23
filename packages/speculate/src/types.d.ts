// --------------------------------------------------------
// Speculate Links

export type SpeculationTriggers =
	| "visible"
	| "immediate"
	| "eager"
	| "moderate"
	| "conservative";

export type SpeculationActions = "prefetch" | "prerender";

// --------------------------------------------------------
// Speculator

export type OptimisticPreloadStrategy = {
	/**
	 * The target element(s) - triggers the onIntent callback immediately
	 */
	immediate: Element | NodeListOf<Element>;
	/**
	 * Intent callback fire priority (1 being the highest)
	 */
	priority?: number;
	/**
	 * Determines if the onIntent callback should be fired
	 */
	condition?: () => boolean;
};

export type SpeculatorConfig<T> = {
	/**
	 * Targets to trigger the onIntent callback, when user intent is determined
	 */
	targets: Element | NodeListOf<Element>;
	/**
	 * Optimistic preload targets and strategy
	 */
	optimistic?: OptimisticPreloadStrategy | OptimisticPreloadStrategy[];
	/**
	 * Fires when use intent is determined or optimisitcally fired
	 */
	onIntent: (element: Element) => Promise<T>;
	/**
	 * The on click callback for the targets
	 */
	onClick?: (data: T, element: Element) => void;
	/**
	 * Cache config
	 */
	cache?: {
		/**
		 * @default 5
		 */
		maxSize?: number;
		/**
		 * Time in milliseconds
		 * @default 120000
		 */
		staleTime?: number;
	};
	/**
	 * Control the cache key thats used. This will fallback to the elements ID.
	 * If no cache key exists, the onIntent promise wont be cached.
	 */
	getCacheKey?: (element: Element) => string;
	/**
	 * Intent debounce
	 */
	intentDebounceTimeout?: number;
};

// old
export type PrefetchDataConfig<T> = {
	target: string;
	fetch: () => Promise<T>;
	onClick: (res: T) => void;
	staletime?: number;
};
