import start from "./core/start.js";
import destroy from "./core/destroy.js";
import refresh from "./core/refresh.js";
import sync from "./core/sync.js";
export { default as storeModule } from "./core/store-module.js";
export { default as registerHandler } from "./core/register-handler.js";
export { createSignal, createEffect, createMemo } from "solid-js";

export default {
	start,
	destroy,
	refresh,
	sync,
};
