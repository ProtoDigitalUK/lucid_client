import updateStateAttributes from "./update-state-attributes.js";
import registerActionEffects from "./register-action-effects.js";

const bind = {
	updateAttributes: updateStateAttributes,
	registerActionEffects,
};

export default bind;
