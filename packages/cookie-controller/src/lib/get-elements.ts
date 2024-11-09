import C from "../constants.js";

/**
 * Get the required elements for the library
 */
const getElements = () => ({
	details: document.querySelector(`[${C.attributes.details}]`),
	alert: document.querySelector(`[${C.attributes.alert}]`),
	categoryCheckboxes: document.querySelectorAll(
		`input[type="checkbox"][${C.attributes.cookieCategory}]`,
	) as NodeListOf<HTMLInputElement>,
	actionDismiss: document.querySelectorAll(
		`[${C.attributes.action.attribute}="${C.attributes.action.value.dismiss}"]`,
	),
	actionAccept: document.querySelectorAll(
		`[${C.attributes.action.attribute}="${C.attributes.action.value.accept}"]`,
	),
	actionReject: document.querySelectorAll(
		`[${C.attributes.action.attribute}="${C.attributes.action.value.reject}"]`,
	),
	actionDetails: document.querySelectorAll(
		`[${C.attributes.action.attribute}="${C.attributes.action.value.details}"]`,
	),
	actionSave: document.querySelectorAll(
		`[${C.attributes.action.attribute}="${C.attributes.action.value.save}"]`,
	),
});

export default getElements;
