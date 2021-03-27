import {Disposable} from '../../model/disposable';
import {Emitter} from '../../model/emitter';
import {Ticker, TickerEvents} from './ticker';

/**
 * @hidden
 */
export class ManualTicker implements Ticker {
	public readonly disposable: Disposable;
	public readonly emitter: Emitter<TickerEvents>;
	public disabled = false;

	constructor() {
		this.disposable = new Disposable();
		this.emitter = new Emitter();
	}

	public tick(): void {
		if (this.disabled) {
			return;
		}

		this.emitter.emit('tick', {
			sender: this,
		});
	}
}
