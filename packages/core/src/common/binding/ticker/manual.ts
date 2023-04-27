import {Emitter} from '../../model/emitter.js';
import {Ticker, TickerEvents} from './ticker.js';

/**
 * @hidden
 */
export class ManualTicker implements Ticker {
	public readonly emitter: Emitter<TickerEvents>;
	public disabled = false;

	constructor() {
		this.emitter = new Emitter();
	}

	public dispose(): void {}

	public tick(): void {
		if (this.disabled) {
			return;
		}

		this.emitter.emit('tick', {
			sender: this,
		});
	}
}
