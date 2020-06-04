import {Emitter, EventTypeMap} from '../misc/emitter';
import {Disposable} from './disposable';

/**
 * @hidden
 */
export interface ViewModelEvents extends EventTypeMap {
	change: {
		sender: ViewModel;
	};
	dispose: {
		sender: ViewModel;
	};
}

export class ViewModel {
	public readonly emitter: Emitter<ViewModelEvents>;
	private disposable_: Disposable;
	private visible_: boolean;

	constructor() {
		this.onDispose_ = this.onDispose_.bind(this);

		this.emitter = new Emitter();
		this.visible_ = true;

		this.disposable_ = new Disposable();
		this.disposable_.emitter.on('dispose', this.onDispose_);
	}

	get visible(): boolean {
		return this.visible_;
	}

	set visible(visible: boolean) {
		if (this.visible_ === visible) {
			return;
		}

		this.visible_ = visible;
		this.emitter.emit('change', {
			sender: this,
		});
	}

	get disposed(): boolean {
		return this.disposable_.disposed;
	}

	public dispose(): void {
		this.disposable_.dispose();
	}

	private onDispose_(): void {
		this.emitter.emit('dispose', {
			sender: this,
		});
	}
}
