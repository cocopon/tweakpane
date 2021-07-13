import {Emitter} from './emitter';
import {Value, ValueChangeOptions, ValueEvents} from './value';

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
		this.setRawValue(value, {
			forceEmit: false,
			last: true,
		});
	}

	public setRawValue(value: T, options?: ValueChangeOptions): void {
		const opts = options ?? {
			forceEmit: false,
			last: true,
		};

		if (this.value_ === value && !opts.forceEmit) {
			return;
		}

		this.emitter.emit('beforechange', {
			sender: this,
		});

		this.value_ = value;

		this.emitter.emit('change', {
			options: opts,
			rawValue: this.value_,
			sender: this,
		});
	}
}
