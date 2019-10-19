import {Emitter} from '../emitter';

/**
 * @hidden
 */
export interface Ticker {
	readonly emitter: Emitter<'tick'>;

	dispose(): void;
}
