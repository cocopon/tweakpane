import MonitorValue from '../model/monitor-value';
import Target from '../model/target';

import {Ticker} from '../misc/ticker/ticker';

interface Config<In> {
	reader: (outerValue: unknown) => In;
	target: Target;
	ticker: Ticker;
	value: MonitorValue<In>;
}

export default class MonitorBinding<In> {
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

	public read(): void {
		const targetValue = this.target.read();
		if (targetValue !== undefined) {
			this.value.append(this.reader_(targetValue));
		}
	}

	private onTick_(): void {
		this.read();
	}
}
