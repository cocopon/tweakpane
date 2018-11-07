// @flow

import Emitter from '../emitter';

import type {Ticker} from './ticker';

type EventType = 'tick';

export default class IntervalTicker implements Ticker {
	emitter_: Emitter<EventType>;

	constructor() {
		this.emitter_ = new Emitter();
	}

	get emitter(): Emitter<EventType> {
		return this.emitter_;
	}

	tick(): void {
		this.emitter_.emit('tick');
	}
}
