import type { SpeculationTriggers, SpeculationActions } from "../types.js";

const C: {
	moderateEvents: Array<keyof HTMLElementEventMap>;
	fallbackTriggerSupport: Array<SpeculationTriggers>;
	fallbackTrigger: SpeculationTriggers;
	fallbackAction: SpeculationActions;
	validActions: SpeculationActions[];
	validTriggers: SpeculationTriggers[];
} = {
	moderateEvents: ["mouseenter", "touchstart", "focus"],
	fallbackTriggerSupport: ["visible", "moderate"],
	fallbackTrigger: "moderate",
	fallbackAction: "prefetch",
	validActions: ["prefetch", "prerender"],
	validTriggers: ["visible", "immediate", "eager", "moderate", "conservative"],
};

let initialised = false;
const prefetched = new Set<string>();
const speculationSupport = HTMLScriptElement.supports("speculationrules");
const prefetchSupport = document
	.createElement("link")
	.relList?.supports?.("prefetch");
let observer: IntersectionObserver;

/**
 * Unobserves and deregisters the target anchor element
 */
const unobserve = (target: HTMLAnchorElement) => {
	observer.unobserve(target);
	removeEventListeners(target);
};

/**
 * Handles registering event listeners for the given moderate trigger elements
 */
const addEventListeners = (element: HTMLAnchorElement) => {
	for (const event of C.moderateEvents) {
		element.addEventListener(event, intentEvent, { passive: true });
	}
};

/**
 * Handles unregistering event listeners for the given moderate trigger elements
 */
const removeEventListeners = (element: HTMLAnchorElement) => {
	for (const event of C.moderateEvents) {
		element.removeEventListener(event, intentEvent);
	}
};

/**
 * Handles the event for the given intent trigger elements
 */
const intentEvent = (e: Event) => {
	const target = e.target as HTMLAnchorElement | null;
	if (!target) return;
	triggerAction(target, parseLinkRel(target.rel));
};

const triggerAction = (
	target: HTMLAnchorElement,
	config: [SpeculationActions, SpeculationTriggers],
) => {
	if (!shouldPreload({ href: target.href, target: target.target })) {
		return unobserve(target);
	}

	if (speculationSupport) addSpeculationRules(target.href, config);
	else if (prefetchSupport) addLinkPrefetch(target.href);
	else fetch(target.href, { priority: "low" });

	prefetched.add(target.href);
	unobserve(target);
};

/**
 * Adds a speculation rule to the document head
 */
const addSpeculationRules = (
	href: string,
	config: [SpeculationActions, SpeculationTriggers],
) => {
	try {
		const specScript = document.createElement("script");
		specScript.type = "speculationrules";
		const item = [
			{
				source: "list",
				urls: [href],
				eagerness: config[1] === "visible" ? undefined : config[1],
			},
		];
		specScript.textContent =
			config[0] === "prefetch"
				? JSON.stringify({
						prefetch: item,
					})
				: JSON.stringify({
						// prefetch is used as a fallback when prerender fails
						prerender: item,
						prefetch: item,
					});
		document.head.appendChild(specScript);
	} catch (e) {
		console.error(e);
	}
};

/**
 * Adds a link prefetch to the document head
 */
const addLinkPrefetch = (href: string) => {
	const link = document.createElement("link");
	link.rel = "prefetch";
	link.href = href;
	link.as = "document";
	document.head.appendChild(link);
};

/**
 * Parses the link rel attribute and determines the correct action and trigger based on support
 * @param rel The link rel attribute
 * @returns A tuple of the action and trigger
 */
const parseLinkRel = (
	rel: string,
): [SpeculationActions, SpeculationTriggers] => {
	let action: string | undefined;
	let trigger: string | undefined;

	for (const part of rel.split(" ")) {
		if (part.startsWith("prefetch:") || part.startsWith("prerender:")) {
			[action, trigger] = part.split(":");
			break;
		}
	}

	if (!action) action = C.fallbackAction;
	if (!trigger) trigger = C.fallbackTrigger;

	if (!speculationSupport) {
		// prerender defaults to prefetch when speculation rules are not supported
		action = C.fallbackAction;
		// fallback to intent, if trigger is not supported
		if (!C.fallbackTriggerSupport.includes(trigger as SpeculationTriggers))
			trigger = C.fallbackTrigger;
	}

	if (!C.validActions.includes(action as SpeculationActions))
		action = C.fallbackAction;
	if (!C.validTriggers.includes(trigger as SpeculationTriggers))
		trigger = C.fallbackTrigger;

	return [action, trigger] as [SpeculationActions, SpeculationTriggers];
};

/**
 * Determines if the given link should be preloaded
 */
const shouldPreload = (props: {
	href: string;
	target: string;
}): boolean => {
	try {
		props.href = props.href.replace(/#.*/, "");
		if (props.target === "_blank") return false;
		if (props.href.includes("mailto:")) return false;
		if (props.href.includes("tel:")) return false;

		const url = new URL(props.href);
		if (url.origin !== window.location.origin) return false;
		if (url.pathname === window.location.pathname) return false;
		if (prefetched.has(props.href)) return false;

		return true;
	} catch (_) {
		return false;
	}
};

/**
 * Connection check
 */
const checkConnection = () => {
	if (!navigator.onLine) {
		console.warn("The device is offline, speculate library not initialised.");
		return;
	}
	if ("connection" in navigator) {
		const connection = navigator.connection;
		// @ts-expect-error
		if (connection?.saveData) {
			console.warn("Save-Data is enabled, speculate library not initialised.");
			return;
		}
		// @ts-expect-error
		if (/(2|3)g/.test(connection?.effectiveType)) {
			console.warn(
				"2G or 3G connection is detected, speculate library not initialised.",
			);
			return;
		}
	}
};

/**
 * Initialises the speculation library
 */
const speculationLinks = () => {
	if (initialised) return;
	initialised = true;

	checkConnection();

	// setup observer
	observer =
		observer ||
		new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
					const target = entry.target;
					const [action, trigger] = parseLinkRel(target.rel);

					if (trigger === "visible") triggerAction(target, [action, trigger]);
					else unobserve(target);
				}
			}
		});

	// setup link config, observers and events
	const targetLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
		'a[rel*="prefetch:"], a[rel*="prerender:"]',
	);

	for (const l of targetLinks) {
		const [action, trigger] = parseLinkRel(l.rel);

		if (trigger === "visible") {
			observer.observe(l);
		}
		// piggyback off moderate trigger for prefetch when speculation rules are not supported
		else if (trigger === "moderate" && !speculationSupport) {
			addEventListeners(l);
		} else {
			triggerAction(l, [action, trigger]);
		}
	}
};

/**
 * Initialises the speculation library using requestIdleCallback if available
 */
const init = () =>
	typeof requestIdleCallback !== "undefined"
		? requestIdleCallback(speculationLinks)
		: setTimeout(speculationLinks, 0);

export default init;
