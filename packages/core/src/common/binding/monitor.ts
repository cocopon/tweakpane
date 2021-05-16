import {Ticker, TickerEvents} from '../binding/ticker/ticker';
import {BufferedValue, createPushedBuffer} from '../model/buffered-value';
import {Emitter} from '../model/emitter';
import {BindingReader} from './binding';
import {BindingTarget} from './target';

interface Config<T> {
	reader: BindingReader<T>;
	target: BindingTarget;
	ticker: Ticker;
	value: BufferedValue<T>;
}

/**
 * @hidden
 */
export interface MonitorBindingEvents<T> {
	update: {
		rawValue: T;
		sender: MonitorBinding<T>;
	};
}

/**
 * @hidden
 */
export class MonitorBinding<T> {
	public readonly emitter: Emitter<MonitorBindingEvents<T>>;
	public readonly target: BindingTarget;
	public readonly ticker: Ticker;
	public readonly value: BufferedValue<T>;
	private reader_: BindingReader<T>;

	constructor(config: Config<T>) {
		this.onTick_ = this.onTick_.bind(this);

		this.reader_ = config.reader;
		this.target = config.target;
		this.emitter = new Emitter();

		this.value = config.value;

		this.ticker = config.ticker;
		this.ticker.emitter.on('tick', this.onTick_);

		this.read();
	}

	public dispose(): void {
		this.ticker.dispose();
	}

	public read(): void {
		const targetValue = this.target.read();
		if (targetValue === undefined) {
			return;
		}

		const buffer = this.value.rawValue;
		const newValue = this.reader_(targetValue);
		this.value.rawValue = createPushedBuffer(buffer, newValue);
		this.emitter.emit('update', {
			rawValue: newValue,
			sender: this,
		});
	}

	private onTick_(_: TickerEvents['tick']): void {
		this.read();
	}
}
