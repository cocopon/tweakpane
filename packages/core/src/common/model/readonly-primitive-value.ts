import {Emitter} from './emitter';
import {ReadonlyValue, Value, ValueEvents} from './value';

export class ReadonlyPrimitiveValue<T> implements ReadonlyValue<T> {
	private value_: Value<T>;

	constructor(value: Value<T>) {
		this.value_ = value;
	}

	/**
	 * The event emitter for value changes.
	 */
	get emitter(): Emitter<ValueEvents<T>> {
		return this.value_.emitter;
	}

	/**
	 * The raw value of the model.
	 */
	get rawValue(): T {
		return this.value_.rawValue;
	}
}
