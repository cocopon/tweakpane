// @flow

import MonitorValue from '../model/monitor-value';
import Target from '../model/target';

import type {Ticker} from '../misc/ticker/ticker';

type Config<In> = {
	reader: (outerValue: mixed) => In,
	target: Target,
	ticker: Ticker,
	value: MonitorValue<In>,
};

export default class MonitorBinding<In> {
	+target: Target;
	+ticker: Ticker;
	+value: MonitorValue<In>;
	reader_: (outerValue: mixed) => In;

	constructor(config: Config<In>) {
		this.reader_ = config.reader;
		this.target = config.target;
		this.value = config.value;

		this.ticker = config.ticker;
		this.ticker.emitter.on('tick', () => {
			this.read();
		});

		this.read();
	}

	read(): void {
		const targetValue = this.target.read();
		if (targetValue !== undefined) {
			this.value.append(
				this.reader_(targetValue),
			);
		}
	}

	onTick_(): void {
		this.read();
	}
}
