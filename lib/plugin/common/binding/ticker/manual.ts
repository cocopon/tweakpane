import {Disposable} from '../../model/disposable';
import {Emitter} from '../../model/emitter';
import {Ticker, TickerEvents} from './ticker';

/**
 * @hidden
 */
export class ManualTicker implements Ticker {
	public readonly disposable: Disposable;
	public readonly emitter: Emitter<TickerEvents>;

	constructor() {
		this.disposable = new Disposable();
		this.emitter = new Emitter();
	}

	public tick(): void {
		this.emitter.emit('tick', {
			sender: this,
		});
	}
}
