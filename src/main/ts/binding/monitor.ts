import {Emitter} from '../misc/emitter';
import {Ticker, TickerEvents} from '../misc/ticker/ticker';
import {BufferedValue, createPushedBuffer} from '../model/buffered-value';
import {Target} from '../model/target';

interface Config<In> {
	reader: (outerValue: unknown) => In;
	target: Target;
	ticker: Ticker;
	value: BufferedValue<In>;
}

/**
 * @hidden
 */
export interface MonitorBindingEvents<In> {
	update: {
		rawValue: In;
		sender: MonitorBinding<In>;
	};
}

/**
 * @hidden
 */
export class MonitorBinding<In> {
	public readonly emitter: Emitter<MonitorBindingEvents<In>>;
	public readonly target: Target;
	public readonly ticker: Ticker;
	public readonly value: BufferedValue<In>;
	private reader_: (outerValue: unknown) => In;

	constructor(config: Config<In>) {
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
		this.ticker.disposable.dispose();
	}

	public read(): void {
		const targetValue = this.target.read();
		if (targetValue !== undefined) {
			const buffer = this.value.rawValue;
			const newValue = this.reader_(targetValue);

			this.value.rawValue = createPushedBuffer(buffer, newValue);
			this.emitter.emit('update', {
				rawValue: newValue,
				sender: this,
			});
		}
	}

	private onTick_(_: TickerEvents['tick']): void {
		this.read();
	}
}
