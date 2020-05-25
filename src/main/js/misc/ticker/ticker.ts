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
	readonly emitter: Emitter<TickerEvents>;

	dispose(): void;
}
