import {Emitter} from '../emitter';
import {Ticker, TickerEvents} from './ticker';

/**
 * @hidden
 */
export class ManualTicker implements Ticker {
	public readonly emitter: Emitter<TickerEvents>;

	constructor() {
		this.emitter = new Emitter();
	}

	public dispose(): void {
		// Do nothing
	}

	public tick(): void {
		this.emitter.emit('tick', {
			sender: this,
		});
	}
}
