import {Emitter} from './emitter';

/**
 * @hidden
 */
export interface DisposableEvents {
	dispose: {
		sender: Disposable;
	};
}

/**
 * @hidden
 */
export class Disposable {
	public readonly emitter: Emitter<DisposableEvents>;
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
		this.emitter.emit('dispose', {
			sender: this,
		});
		return true;
	}
}
