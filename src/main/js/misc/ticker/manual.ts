import Emitter from '../emitter';

import {Ticker} from './ticker';

type EventType = 'tick';

export default class IntervalTicker implements Ticker {
	public readonly emitter: Emitter<EventType>;

	constructor() {
		this.emitter = new Emitter();
	}

	public tick(): void {
		this.emitter.emit('tick');
	}
}
