import {
	BufferedValue,
	BufferedValueEvents,
	createPushedBuffer,
	initializeBuffer,
	TpBuffer,
} from '../../model/buffered-value.js';
import {Emitter} from '../../model/emitter.js';
import {ValueChangeOptions} from '../../model/value.js';
import {createValue} from '../../model/values.js';
import {isBinding} from '../binding.js';
import {ReadonlyBinding} from '../readonly.js';
import {Ticker} from '../ticker/ticker.js';
import {BindingValue} from './binding.js';

/**
 * @hidden
 */
interface Config<T> {
	binding: ReadonlyBinding<T>;
	bufferSize: number;
	ticker: Ticker;
}

/**
 * @hidden
 */
export class MonitorBindingValue<T> implements BindingValue<TpBuffer<T>> {
	public readonly binding: ReadonlyBinding<T>;
	public readonly emitter: Emitter<BufferedValueEvents<T>> = new Emitter();
	public readonly ticker: Ticker;
	private readonly value_: BufferedValue<T>;

	constructor(config: Config<T>) {
		this.onTick_ = this.onTick_.bind(this);
		this.onValueBeforeChange_ = this.onValueBeforeChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.binding = config.binding;

		this.value_ = createValue(initializeBuffer<T>(config.bufferSize));
		this.value_.emitter.on('beforechange', this.onValueBeforeChange_);
		this.value_.emitter.on('change', this.onValueChange_);

		this.ticker = config.ticker;
		this.ticker.emitter.on('tick', this.onTick_);

		this.fetch();
	}

	get rawValue(): TpBuffer<T> {
		return this.value_.rawValue;
	}

	set rawValue(rawValue: TpBuffer<T>) {
		this.value_.rawValue = rawValue;
	}

	public setRawValue(
		rawValue: TpBuffer<T>,
		options?: ValueChangeOptions | undefined,
	): void {
		this.value_.setRawValue(rawValue, options);
	}

	public fetch(): void {
		this.value_.rawValue = createPushedBuffer(
			this.value_.rawValue,
			this.binding.read(),
		);
	}

	private onTick_(): void {
		this.fetch();
	}

	private onValueBeforeChange_(
		ev: BufferedValueEvents<T>['beforechange'],
	): void {
		this.emitter.emit('beforechange', {
			...ev,
			sender: this,
		});
	}

	private onValueChange_(ev: BufferedValueEvents<T>['change']): void {
		this.emitter.emit('change', {
			...ev,
			sender: this,
		});
	}
}

export function isMonitorBindingValue(
	v: BufferedValue<unknown>,
): v is MonitorBindingValue<unknown> {
	if (!('binding' in v)) {
		return false;
	}
	const b = v['binding'];
	return isBinding(b) && 'read' in b && !('write' in b);
}
