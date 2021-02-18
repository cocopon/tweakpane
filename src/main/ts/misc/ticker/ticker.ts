import {Disposable} from '../../model/disposable';
import {Emitter} from '../emitter';

/**
 * @hidden
 */
export interface TickerEvents {
	tick: {
		sender: Ticker;
	};
}

/**
 * @hidden
 */
export interface Ticker {
	readonly disposable: Disposable;
	readonly emitter: Emitter<TickerEvents>;
}
