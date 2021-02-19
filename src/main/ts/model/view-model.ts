import {Emitter} from '../misc/emitter';
import {deepEqualsArray} from '../misc/type-util';
import {Disposable} from './disposable';
import {ViewPosition} from './view-positions';

/**
 * @hidden
 */
export interface ViewModelEvents {
	change: {
		propertyName: 'hidden' | 'positions';
		sender: ViewModel;
	};
	dispose: {
		sender: ViewModel;
	};
}

export class ViewModel {
	public readonly emitter: Emitter<ViewModelEvents>;
	private disposable_: Disposable;
	private positions_: ViewPosition[];
	private hidden_: boolean;

	constructor() {
		this.onDispose_ = this.onDispose_.bind(this);

		this.emitter = new Emitter();
		this.positions_ = [];
		this.hidden_ = false;

		this.disposable_ = new Disposable();
		this.disposable_.emitter.on('dispose', this.onDispose_);
	}

	get hidden(): boolean {
		return this.hidden_;
	}

	set hidden(hidden: boolean) {
		if (this.hidden_ === hidden) {
			return;
		}

		this.hidden_ = hidden;
		this.emitter.emit('change', {
			propertyName: 'hidden',
			sender: this,
		});
	}

	get positions(): ViewPosition[] {
		return this.positions_;
	}

	set positions(positions: ViewPosition[]) {
		if (deepEqualsArray(positions, this.positions_)) {
			return;
		}

		this.positions_ = positions;
		this.emitter.emit('change', {
			propertyName: 'positions',
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
