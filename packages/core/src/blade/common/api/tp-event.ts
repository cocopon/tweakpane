/**
 * A base class for Tweakpane API events.
 * @template Target The event target.
 */
export class TpEvent<Target = unknown> {
	/**
	 * The event dispatcher.
	 */
	public readonly target: Target;

	/**
	 * @hidden
	 */
	constructor(target: Target) {
		this.target = target;
	}
}

/**
 * An event class for value changes.
 * @template T The type of the value.
 * @template Target The event target.
 */
export class TpChangeEvent<T, Target = unknown> extends TpEvent<Target> {
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
	constructor(target: Target, value: T, last?: boolean) {
		super(target);

		this.value = value;
		this.last = last ?? true;
	}
}

/**
 * An event class for folder.
 * @template Target The event target.
 */
export class TpFoldEvent<Target> extends TpEvent<Target> {
	/**
	 * The current state of the folder expansion.
	 */
	public readonly expanded: boolean;

	/**
	 * @hidden
	 */
	constructor(target: Target, expanded: boolean) {
		super(target);

		this.expanded = expanded;
	}
}

/**
 * An event class for tab selection.
 * @template Target The event target.
 */
export class TpTabSelectEvent<Target> extends TpEvent<Target> {
	/**
	 * The selected index of the tab item.
	 */
	public readonly index: number;

	/**
	 * @hidden
	 */
	constructor(target: Target, index: number) {
		super(target);

		this.index = index;
	}
}

/**
 * An event class for mouse events.
 * @template Target The event target.
 */
export class TpMouseEvent<Target> extends TpEvent<Target> {
	/**
	 * The native mouse event.
	 */
	public readonly native: MouseEvent;

	/**
	 * @hidden
	 */
	constructor(target: Target, nativeEvent: MouseEvent) {
		super(target);

		this.native = nativeEvent;
	}
}
