import {Binding} from '../binding/binding';
import {Emitter} from './emitter';
import {Value, ValueChangeOptions, ValueEvents} from './value';

export class BindingValue<T> implements Value<T> {
	public readonly binding: Binding<T>;
	public readonly emitter: Emitter<ValueEvents<T>>;
	private readonly value_: Value<T>;

	constructor(value: Value<T>, binding: Binding<T>) {
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

	public read(): void {
		this.value_.rawValue = this.binding.read();
	}

	public write(): void {
		this.binding.write(this.value_.rawValue);
	}

	private onValueBeforeChange_(ev: ValueEvents<T>['beforechange']): void {
		this.emitter.emit('beforechange', {
			...ev,
			sender: this,
		});
	}

	private onValueChange_(ev: ValueEvents<T>['change']): void {
		this.write();
		this.emitter.emit('change', {
			...ev,
			sender: this,
		});
	}
}

export function findValueBinding<T>(value: Value<T>): Binding<T> | null {
	return value instanceof BindingValue ? value.binding : null;
}
