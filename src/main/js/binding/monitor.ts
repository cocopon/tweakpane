import {Emitter, EventTypeMap} from '../misc/emitter';
import {Ticker, TickerEvents} from '../misc/ticker/ticker';
import {MonitorValue, MonitorValueEvents} from '../model/monitor-value';
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
export interface MonitorBindingEvents<In> extends EventTypeMap {
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
	public readonly value: MonitorValue<In>;
	private reader_: (outerValue: unknown) => In;

	constructor(config: Config<In>) {
		this.onTick_ = this.onTick_.bind(this);
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.reader_ = config.reader;
		this.target = config.target;
		this.emitter = new Emitter();

		this.value = config.value;
		this.value.emitter.on('update', this.onValueUpdate_);

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

	private onTick_(_: TickerEvents['tick']): void {
		this.read();
	}

	private onValueUpdate_(ev: MonitorValueEvents<In>['update']): void {
		this.emitter.emit('update', {
			rawValue: ev.rawValue,
			sender: this,
		});
	}
}
