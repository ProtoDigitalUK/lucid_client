import S from "../state.js";

/**
 * Destroys the cookie controller instance and removes all event listeners
 */
const destroy = () => {
	S.abortController.abort();
};

export default destroy;
