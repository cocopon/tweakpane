import {Emitter} from './emitter';

/**
 * @hidden
 */
export interface ValueEvents<In> {
	change: {
		sender: Value<In>;
		rawValue: In;
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
}
