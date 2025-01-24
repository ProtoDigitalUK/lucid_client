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

export type IntentError<D> = {
	message: string;
	exception?: unknown;
	details?: D;
};

export type IntentResult<T, D> =
	| { error: IntentError<D>; data: undefined }
	| { error: undefined; data: NonNullable<T> };

export type IntentResponse<T, D> = Promise<IntentResult<T, D>>;

export type TargetElements = Element | NodeListOf<Element> | Element[];

export type OptimisticPrefetchStrategy = {
	/**
	 * Elements to prefetch immediately when the strategy is active
	 */
	elements: TargetElements;
	/**
	 * Priority order for prefetching (lower numbers = higher priority)
	 */
	priority?: number;
	/**
	 * A condition that must be true for this strategy to be active
	 */
	condition?: () => boolean;
};

export type SpeculatorConfig<T, D> = {
	/**
	 * Elements that will trigger prefetching when user intent is determined
	 */
	elements: TargetElements;
	/**
	 * Strategies for optimistically prefetching on initialisation when idle
	 */
	optimistic?: OptimisticPrefetchStrategy | OptimisticPrefetchStrategy[];
	/**
	 * Callback that fetches the data for an element when user intent is determined
	 * @returns Promise that resolves with either data or an error
	 */
	fetch: (element: Element) => IntentResponse<T, D>;
	/**
	 * Called when a target element is clicked
	 */
	onClick?: (result: IntentResult<T, D>, element: Element) => void;
	/**
	 * Cache configuration to control data freshness and memory usage
	 */
	cache?: {
		/**
		 * Maximum number of responses to keep in cache
		 * @default 5
		 */
		maxSize?: number;
		/**
		 * How long cached responses remain valid (in milliseconds)
		 * @default 120000
		 */
		staleTime?: number;
	};
	/**
	 * Generate a cache key for an element. Used to store and retrieve cached responses.
	 * By default, it will fallback to the elements ID if it has one, otherwise responses will not be cached.
	 * Return null/undefined to skip caching for an element.
	 */
	getCacheKey?: (element: Element) => string | undefined | null;
	/**
	 * Delay before prefetching on hover (in milliseconds).
	 * Helps avoid unnecessary loads during quick mouse movements.
	 * @default 200
	 */
	hoverDelay?: number;
};
