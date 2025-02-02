import Elements, { storeModule } from "@lucidclient/elements";
import { events, dom, trap } from "@lucidclient/elements/handlers";
import { speculateLinks } from "@lucidclient/speculate";
import "./speculate/speculator";

import loopsStore from "./elements/loops";
import exampleStore from "./elements/example";
import navStore from "./elements/nav";

storeModule("loops", loopsStore);
storeModule("example", exampleStore);
storeModule("nav", navStore);

Elements.start({
	debug: true,
	handlers: [events, dom, trap],
});

speculateLinks();
