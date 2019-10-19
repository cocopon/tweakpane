import {Emitter} from '../emitter';
import {Ticker} from './ticker';

type EventType = 'tick';

/**
 * @hidden
 */
export class IntervalTicker implements Ticker {
	public readonly emitter: Emitter<EventType>;
	private active_: boolean;
	private doc_: Document;
	private id_: number | null;

	constructor(document: Document, interval: number) {
		this.onTick_ = this.onTick_.bind(this);
		this.onWindowBlur_ = this.onWindowBlur_.bind(this);
		this.onWindowFocus_ = this.onWindowFocus_.bind(this);

		this.active_ = true;
		this.doc_ = document;
		this.emitter = new Emitter();

		if (interval <= 0) {
			this.id_ = null;
		} else {
			const win = this.doc_.defaultView;
			if (win) {
				this.id_ = win.setInterval(() => {
					if (!this.active_) {
						return;
					}

					this.onTick_();
				}, interval);
			}
		}

		// TODO: Stop on blur?
		// const win = document.defaultView;
		// if (win) {
		//   win.addEventListener('blur', this.onWindowBlur_);
		//   win.addEventListener('focus', this.onWindowFocus_);
		// }
	}

	public dispose(): void {
		if (this.id_ !== null) {
			const win = this.doc_.defaultView;
			if (win) {
				win.clearInterval(this.id_);
			}
		}
		this.id_ = null;
	}

	private onTick_(): void {
		this.emitter.emit('tick');
	}

	private onWindowBlur_(): void {
		this.active_ = false;
	}

	private onWindowFocus_(): void {
		this.active_ = true;
	}
}
