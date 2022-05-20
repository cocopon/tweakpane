import {Emitter} from '../../model/emitter';
import {Ticker, TickerEvents} from './ticker';

/**
 * @hidden
 */
export class IntervalTicker implements Ticker {
	public readonly emitter: Emitter<TickerEvents>;
	private readonly interval_: number;
	private readonly doc_: Document;
	private disabled_ = false;
	private timerId_: number | null = null;

	constructor(doc: Document, interval: number) {
		this.onTick_ = this.onTick_.bind(this);
		// this.onWindowBlur_ = this.onWindowBlur_.bind(this);
		// this.onWindowFocus_ = this.onWindowFocus_.bind(this);

		this.doc_ = doc;
		this.emitter = new Emitter();
		this.interval_ = interval;

		this.setTimer_();

		// TODO: Stop on blur?
		// const win = document.defaultView;
		// if (win) {
		//   win.addEventListener('blur', this.onWindowBlur_);
		//   win.addEventListener('focus', this.onWindowFocus_);
		// }
	}

	get disabled() {
		return this.disabled_;
	}

	set disabled(inactive: boolean) {
		this.disabled_ = inactive;
		if (this.disabled_) {
			this.clearTimer_();
		} else {
			this.setTimer_();
		}
	}

	public dispose(): void {
		this.clearTimer_();
	}

	private clearTimer_() {
		if (this.timerId_ === null) {
			return;
		}

		const win = this.doc_.defaultView;
		if (win) {
			win.clearInterval(this.timerId_);
		}
		this.timerId_ = null;
	}

	private setTimer_() {
		this.clearTimer_();

		if (this.interval_ <= 0) {
			return;
		}

		const win = this.doc_.defaultView;
		if (win) {
			this.timerId_ = win.setInterval(this.onTick_, this.interval_);
		}
	}

	private onTick_(): void {
		if (this.disabled_) {
			return;
		}

		this.emitter.emit('tick', {
			sender: this,
		});
	}

	// private onWindowBlur_(): void {
	// 	this.inactive = true;
	// }

	// private onWindowFocus_(): void {
	// 	this.inactive = false;
	// }
}
