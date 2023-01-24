import {Emitter} from './emitter';
import {Value, ValueChangeOptions, ValueEvents} from './value';

export type SetRawValue<T> = (
	rawValue: T,
	options?: ValueChangeOptions | undefined,
) => void;

export class ReadonlyValue<T> {
	private value_: Value<T>;

	constructor(value: Value<T>) {
		this.value_ = value;
	}

	public static create<T>(value: Value<T>): [ReadonlyValue<T>, SetRawValue<T>] {
		return [
			new ReadonlyValue(value),
			(rawValue: T, options: ValueChangeOptions | undefined) => {
				value.setRawValue(rawValue, options);
			},
		];
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
