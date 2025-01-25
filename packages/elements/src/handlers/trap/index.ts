import { createRoot, createSignal, createEffect } from "solid-js";
import {
	buildHandlerSelector,
	findStoreMember,
	resolveMember,
} from "../../helpers.js";
import type { Handler } from "../../types/index.js";
import type { TrapState } from "./types.js";

const namespace = "trap";
let disposeHandler: () => void;
const [activeFocusTraps, setActiveFocusTraps] = createSignal<TrapState[]>([]);

/**
 * Returns sibling elements to the target
 */
const getSiblingElements = (element: HTMLElement): HTMLElement[] => {
	const result: HTMLElement[] = [];
	const children = document.body.children;

	for (let i = 0; i < children.length; i++) {
		const el = children[i];
		if (
			el instanceof HTMLElement &&
			el !== element &&
			!el.contains(element) &&
			!element.contains(el)
		) {
			result.push(el);
		}
	}

	return result;
};

/**
 * Manages the trap stae on a global level
 */
const manageTrapState = (target: HTMLElement, shouldTrap: boolean) => {
	if (shouldTrap) {
		const siblings = getSiblingElements(target);
		const previousActive = document.activeElement as HTMLElement;

		setActiveFocusTraps((traps) => [
			...traps,
			{
				element: target,
				previousActiveElement: previousActive,
				siblingElements: siblings,
			},
		]);

		for (const sibling of siblings) {
			sibling.setAttribute("inert", "");
		}
		target.focus();
		document.body.style.overflow = "hidden";
		return;
	}

	setActiveFocusTraps((traps) => {
		const trapToRemove = traps.find((t) => t.element === target);
		const newTraps = traps.filter((t) => t.element !== target);

		if (trapToRemove) {
			for (const sibling of trapToRemove.siblingElements) {
				sibling.removeAttribute("inert");
			}

			if (newTraps.length === 0) {
				trapToRemove.previousActiveElement?.focus();
				document.body.style.overflow = "";
			}
		}

		return newTraps;
	});
};

/**
 * Registers the trap handler. These can be used like so:
 * - data-handler--trap="scope:$state"
 * - data-handler--trap="scope:@action"
 */
const trapHandler: Handler = {
	namespace,
	initialise: (attributes) => {
		createRoot((dispose) => {
			disposeHandler = dispose;

			for (const [specifier, actions] of attributes) {
				for (const key of actions) {
					const member = findStoreMember(key);
					if (!member) continue;

					const targets = document.querySelectorAll(
						buildHandlerSelector(namespace, specifier, key),
					);

					createEffect(async () => {
						const shouldTrap = await resolveMember(member);
						for (const target of targets) {
							if (target instanceof HTMLElement) {
								manageTrapState(target, Boolean(shouldTrap));
							}
						}
					});
				}
			}
		});
	},
	destroy: () => {
		for (const trap of activeFocusTraps()) {
			for (const sibling of trap.siblingElements) {
				sibling.removeAttribute("inert");
			}
		}
		document.body.style.overflow = "";
	},
};

export default trapHandler;
