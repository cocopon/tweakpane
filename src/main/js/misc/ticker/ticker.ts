import {Disposable} from '../../model/disposable';
import {Emitter, EventTypeMap} from '../emitter';

/**
 * @hidden
 */
export interface TickerEvents extends EventTypeMap {
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
