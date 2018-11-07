// @flow

import Emitter from '../emitter';

import type {Ticker} from './ticker';

type EventType = 'tick';

export default class IntervalTicker implements Ticker {
	active_: boolean;
	emitter_: Emitter<EventType>;
	id_: ?IntervalID;

	constructor(_document: Document, interval: number) {
		(this: any).onTick_ = this.onTick_.bind(this);
		(this: any).onWindowBlur_= this.onWindowBlur_.bind(this);
		(this: any).onWindowFocus_ = this.onWindowFocus_.bind(this);

		this.active_ = true;

		this.emitter_ = new Emitter();
		if (interval > 0) {
			this.id_ = setInterval(() => {
				if (!this.active_) {
					return;
				}

				this.onTick_();
			}, interval);
		}

		// TODO: Stop on blur?
		//		const win = document.defaultView;
		//		if (win) {
		//			win.addEventListener('blur', this.onWindowBlur_);
		//			win.addEventListener('focus', this.onWindowFocus_);
		//		}
	}

	get emitter(): Emitter<EventType> {
		return this.emitter_;
	}

	dispose(): void {
		if (this.id_) {
			clearInterval(this.id_);
			this.id_ = null;
		}
	}

	onTick_(): void {
		this.emitter_.emit('tick');
	}

	onWindowBlur_(): void {
		this.active_ = false;
	}

	onWindowFocus_(): void {
		this.active_ = true;
	}
}
