import { Emitter } from './emitter';

/**
 * @hidden
 */
export interface ValueChangeOptions {
	/**
	 * The flag indicating whether an event should be fired even if the value doesn't change.
	 */
	forceEmit: boolean;
	/**
	 * The flag indicating whether the event is for the last change.
	 */
	last: boolean;

	before?: boolean;

	emit: boolean;
}

/**
 * @hidden
 */
export interface ValueEvents<T> {
	beforechange: {
		sender: Value<T>;
	};
	change: {
		options: ValueChangeOptions;
		previousRawValue: T;
		rawValue: T;
		sender: Value<T>;
	};
}

/**
 * A model for handling value changes.
 * @template T The type of the raw value.
 */
export interface Value<T> {
	/**
	 * The event emitter for value changes.
	 */
	readonly emitter: Emitter<ValueEvents<T>>;
	/**
	 * The raw value of the model.
	 */
	rawValue: T;

	setRawValue(rawValue: T, options?: ValueChangeOptions): void;
}
