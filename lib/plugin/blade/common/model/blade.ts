import {deepEqualsArray} from '../../../../misc/type-util';
import {Disposable} from '../../../common/model/disposable';
import {Emitter} from '../../../common/model/emitter';
import {BladePosition} from './blade-positions';

/**
 * @hidden
 */
export interface BladeEvents {
	change: {
		propertyName: 'hidden' | 'positions';
		sender: Blade;
	};
	dispose: {
		sender: Blade;
	};
}

export class Blade {
	public readonly emitter: Emitter<BladeEvents>;
	private disposable_: Disposable;
	private positions_: BladePosition[];
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

	get positions(): BladePosition[] {
		return this.positions_;
	}

	set positions(positions: BladePosition[]) {
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
