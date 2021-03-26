import {Disposable} from '../../model/disposable';
import {Emitter} from '../../model/emitter';

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
	disabled: boolean;
}
