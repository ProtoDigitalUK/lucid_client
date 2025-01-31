export type StateKey = string; // $state
export type ActionKey = string; // @action
export type MemeberKey = StateKey | ActionKey;

// scope:$state or scope:@action
export type ScopedState = `${string}:${StateKey}`;
export type ScopedAction = `${string}:${ActionKey}`;
export type ScopedMember = ScopedState | ScopedAction;

// ----------------
// State directives

export type StateValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| object
	| Array<unknown>;

/**
 * Stores the key and value of a state attribute. \
 * Ie: `data-state--disabled="false"` would be stored as `['disabled', 'false']`
 * @note the StateKey doesnt include the $ prefix here
 */
export type StateDirectives = Map<StateKey, StateValue>;

// ----------------
// Handler directives

export type HandlerNamespace = string; // event, dom, trap, etc.
export type HandlerSpecifier = string; // click, document.click, trap, trap.both, etc.
export type HandlerSpecifiersMap = Map<HandlerSpecifier, Set<ScopedMember>>;

/**
 * Stores a Map of namespaces, their specifiers and all handlers members \
 * `data-handler--HandlerNamespace.HandlerSpecifier="ScopedMember"`
 */
export type HandlerDirectives = Map<HandlerNamespace, HandlerSpecifiersMap>;

// ----------------
// Bind directives

export type BindAttributeName = string; // aria-label | aria-expanded | data-exmaple

export type BindStateDirectives = Map<StateKey, Set<BindAttributeName>>; // Map<state, Set<aria-label | aria-expanded | data-exmaple>>
export type BindActionDirectives = Map<ActionKey, Set<BindAttributeName>>; // Map<action, Set<aria-label | aria-expanded | data-exmaple>>

// ----------------
// Effect Attributes

export type EffectDirectives = Set<string>;
