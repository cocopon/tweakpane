import Emitter from '../emitter';

export interface Ticker {
	readonly emitter: Emitter<'tick'>;
}
