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
	readonly emitter: Emitter<TickerEvents>;
	disabled: boolean;

	dispose(): void;
}
