import {Emitter} from './emitter.js';

export interface ValueChangeOptions {
	/**
	 * The flag indicating whether an event should be fired even if the value doesn't change.
	 */
	forceEmit: boolean;
	/**
	 * The flag indicating whether the event is for the last change.
	 */
	last: boolean;
}

export interface ValueEvents<T, V = Value<T>> {
	beforechange: {
		sender: V;
	};
	change: {
		options: ValueChangeOptions;
		previousRawValue: T;
		rawValue: T;
		sender: V;
	};
}

/**
 * A value that handles changes.
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

export type ReadonlyValueEvents<T> = ValueEvents<T, ReadonlyValue<T>>;

/**
 * A readonly value that can be changed elsewhere.
 * @template T The type of the raw value.
 */
export interface ReadonlyValue<T> {
	/**
	 * The event emitter for value changes.
	 */
	readonly emitter: Emitter<ReadonlyValueEvents<T>>;
	/**
	 * The raw value of the model.
	 */
	readonly rawValue: T;
}
