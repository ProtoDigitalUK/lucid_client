// ----------------
// State Attributes

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
// Handlers Attributes

export type HandlerNamespace = string;
type HandlerSpecifier = string;
type HandlerAction = string;
export type HandlerAttributes = Map<HandlerSpecifier, Set<HandlerAction>>;

/**
 * Stores a Map of namespaces, their specifiers and all handlers functions \
 * `data-handler--namesapce.specifier="action"`
 */
export type HandlerAttributesMap = Map<HandlerNamespace, HandlerAttributes>;

// ----------------
// Bind Attributes

// the name of the attribute the bind creates and maps to
type AttributeName = string;

/**
 * Stores a map of state keys and all of their bind attributes. \
 */
export type BindStateAttributesMap = Map<StateKey, Set<AttributeName>>;
export type BindActionAttributeMap = Map<HandlerAction, Set<AttributeName>>;
