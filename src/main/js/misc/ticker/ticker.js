// @flow

import Emitter from '../emitter';

export interface Ticker {
	+emitter: Emitter<'tick'>;
}
