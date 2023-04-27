import {Emitter} from '../../model/emitter.js';
import {Value, ValueChangeOptions, ValueEvents} from '../../model/value.js';
import {isBinding} from '../binding.js';
import {ReadWriteBinding} from '../read-write.js';
import {BindingValue} from './binding.js';

/**
 * @hidden
 */
export class InputBindingValue<T> implements BindingValue<T> {
	public readonly binding: ReadWriteBinding<T>;
	public readonly emitter: Emitter<ValueEvents<T>>;
	private readonly value_: Value<T>;

	constructor(value: Value<T>, binding: ReadWriteBinding<T>) {
		this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.binding = binding;

		this.value_ = value;
		this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
		this.value_.emitter.on('change', this.onValueChange_);

		this.emitter = new Emitter();
	}

	get rawValue(): T {
		return this.value_.rawValue;
	}

	set rawValue(rawValue: T) {
		this.value_.rawValue = rawValue;
	}

	public setRawValue(
		rawValue: T,
		options?: ValueChangeOptions | undefined,
	): void {
		this.value_.setRawValue(rawValue, options);
	}

	public fetch(): void {
		this.value_.rawValue = this.binding.read();
	}

	public push(): void {
		this.binding.write(this.value_.rawValue);
	}

	private onValueBeforeChange_(ev: ValueEvents<T>['beforechange']): void {
		this.emitter.emit('beforechange', {
			...ev,
			sender: this,
		});
	}

	private onValueChange_(ev: ValueEvents<T>['change']): void {
		this.push();
		this.emitter.emit('change', {
			...ev,
			sender: this,
		});
	}
}

export function isInputBindingValue(
	v: Value<unknown>,
): v is InputBindingValue<unknown> {
	if (!('binding' in v)) {
		return false;
	}
	const b = v['binding'];
	return isBinding(b) && 'read' in b && 'write' in b;
}
