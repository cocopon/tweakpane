// @flow

import Emitter from '../emitter';

import type {Ticker} from './ticker';

type EventType = 'tick';

export default class IntervalTicker implements Ticker {
	+emitter: Emitter<EventType>;

	constructor() {
		this.emitter = new Emitter();
	}

	tick(): void {
		this.emitter.emit('tick');
	}
}
