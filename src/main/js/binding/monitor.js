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
	reader_: (outerValue: mixed) => In;
	target_: Target;
	ticker_: Ticker;
	value_: MonitorValue<In>;

	constructor(config: Config<In>) {
		this.reader_ = config.reader;
		this.target_ = config.target;
		this.value_ = config.value;

		this.ticker_ = config.ticker;
		this.ticker_.emitter.on('tick', () => {
			this.read();
		});

		this.read();
	}

	get ticker(): Ticker {
		return this.ticker_;
	}

	get value(): MonitorValue<In> {
		return this.value_;
	}

	read(): void {
		const targetValue = this.target_.read();
		if (targetValue !== undefined) {
			this.value_.append(
				this.reader_(targetValue),
			);
		}
	}

	onTick_(): void {
		this.read();
	}
}
