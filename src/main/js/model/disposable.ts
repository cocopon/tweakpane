import {Emitter} from '../misc/emitter';

type EventType = 'dispose';

/**
 * @hidden
 */
export class Disposable {
	public readonly emitter: Emitter<EventType>;
	private disposed_: boolean;

	constructor() {
		this.emitter = new Emitter();
		this.disposed_ = false;
	}

	get disposed(): boolean {
		return this.disposed_;
	}

	dispose(): boolean {
		if (this.disposed_) {
			return false;
		}

		this.disposed_ = true;
		this.emitter.emit('dispose', [this]);
		return true;
	}
}
