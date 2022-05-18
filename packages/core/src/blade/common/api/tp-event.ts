/**
 * A base class of Tweakpane API events.
 */
export class TpEvent {
	/**
	 * The event dispatcher.
	 */
	public readonly target: unknown;

	/**
	 * @hidden
	 */
	constructor(target: unknown) {
		this.target = target;
	}
}

/**
 * An event class for value changes of input bindings.
 * @template T The type of the value.
 */
export class TpChangeEvent<T> extends TpEvent {
	/**
	 * The preset key of the event target.
	 */
	public readonly presetKey?: string;
	/**
	 * The value.
	 */
	public readonly value: T;
	/**
	 * The flag indicating whether the event is for the last change.
	 */
	public readonly last: boolean;

	/**
	 * @hidden
	 */
	constructor(target: unknown, value: T, presetKey?: string, last?: boolean) {
		super(target);

		this.value = value;
		this.presetKey = presetKey;
		this.last = last ?? true;
	}
}

/**
 * An event class for value updates of monitor bindings.
 * @template T The type of the value.
 */
export class TpUpdateEvent<T> extends TpEvent {
	/**
	 * The preset key of the event target.
	 */
	public readonly presetKey: string;
	/**
	 * The value.
	 */
	public readonly value: T;

	/**
	 * @hidden
	 */
	constructor(target: unknown, value: T, presetKey: string) {
		super(target);

		this.value = value;
		this.presetKey = presetKey;
	}
}

/**
 * An event class for folder.
 */
export class TpFoldEvent extends TpEvent {
	/**
	 * The current state of the folder expansion.
	 */
	public readonly expanded: boolean;

	/**
	 * @hidden
	 */
	constructor(target: unknown, expanded: boolean) {
		super(target);

		this.expanded = expanded;
	}
}

/**
 * An event class for tab selection.
 */
export class TpTabSelectEvent extends TpEvent {
	/**
	 * The selected index of the tab item.
	 */
	public readonly index: number;

	/**
	 * @hidden
	 */
	constructor(target: unknown, index: number) {
		super(target);

		this.index = index;
	}
}
