import {Emitter} from './emitter.js';
import {
	ReadonlyValue,
	ReadonlyValueEvents,
	Value,
	ValueEvents,
} from './value.js';

/**
 * @hidden
 */
export class ReadonlyPrimitiveValue<T> implements ReadonlyValue<T> {
	/**
	 * The event emitter for value changes.
	 */
	public readonly emitter: Emitter<ReadonlyValueEvents<T>> = new Emitter();
	private value_: Value<T>;

	constructor(value: Value<T>) {
		this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value_ = value;
		this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
		this.value_.emitter.on('change', this.onValueChange_);
	}

	/**
	 * The raw value of the model.
	 */
	get rawValue(): T {
		return this.value_.rawValue;
	}

	private onValueBeforeChange_(ev: ValueEvents<T>['beforechange']): void {
		this.emitter.emit('beforechange', {
			...ev,
			sender: this,
		});
	}

	private onValueChange_(ev: ValueEvents<T>['change']): void {
		this.emitter.emit('change', {
			...ev,
			sender: this,
		});
	}
}
