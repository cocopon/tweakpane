import {Ticker} from '../misc/ticker/ticker';
import {MonitorValue} from '../model/monitor-value';
import {Target} from '../model/target';

interface Config<In> {
	reader: (outerValue: unknown) => In;
	target: Target;
	ticker: Ticker;
	value: MonitorValue<In>;
}

/**
 * @hidden
 */
export class MonitorBinding<In> {
	public readonly target: Target;
	public readonly ticker: Ticker;
	public readonly value: MonitorValue<In>;
	private reader_: (outerValue: unknown) => In;

	constructor(config: Config<In>) {
		this.onTick_ = this.onTick_.bind(this);

		this.reader_ = config.reader;
		this.target = config.target;
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
		if (targetValue !== undefined) {
			this.value.append(this.reader_(targetValue));
		}
	}

	private onTick_(_: Ticker): void {
		this.read();
	}
}
