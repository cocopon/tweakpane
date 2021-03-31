import {Emitter} from './emitter';
import {Value, ValueEvents} from './value';

export class PrimitiveValue<T> implements Value<T> {
	public readonly emitter: Emitter<ValueEvents<T>>;
	private value_: T;

	constructor(initialValue: T) {
		this.emitter = new Emitter();
		this.value_ = initialValue;
	}

	get rawValue(): T {
		return this.value_;
	}

	set rawValue(value: T) {
		if (this.value_ === value) {
			return;
		}

		this.value_ = value;
		this.emitter.emit('change', {
			sender: this,
			rawValue: this.value_,
		});
	}
}
