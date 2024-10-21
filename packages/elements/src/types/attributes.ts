// ----------------
// State Bindings

type StateKey = string;

/**
 * Stores the name and value of a state attribute. \
 * Ie: `data-state--disabled="false"` would be stored as `['disabled', 'false']`
 */
export type StateAttribtuesMap = Map<
	StateKey,
	string | number | boolean | null | undefined | object | Array<unknown>
>;

// ----------------
// Attribute Bindings

/**
 * Stores the name and value of an attribute binding. \
 * Ie: `data-bind--disabled="disabled"` would be stored as `['disabled', 'disabled']`
 *
 * Note: Bind attributes can be subscribed to multiple states depending on the element its attached to.
 */
type AttributeName = string;

export type BindAttributesMap = Map<AttributeName, Set<StateKey>>;
export type StateBindAttributesMap = Map<StateKey, Set<AttributeName>>;

// ----------------
// Handlers

type Namespace = string;
type Specifier = string;
type HandlerValue = string;

/**
 * Stores a Map of namespaces, their specifiers and all handlers functions \
 * `data-handler--namesapce.specifier="handler"`
 */
export type HandlerAttributesMap = Map<
	Namespace,
	Map<Specifier, Array<HandlerValue>>
>;
