import {Disposable} from '../../../common/model/disposable';
import {Emitter} from '../../../common/model/emitter';
import {deepEqualsArray} from '../../../misc/type-util';
import {BladePosition} from './blade-positions';

/**
 * @hidden
 */
export interface BladeEvents {
	change: {
		propertyName: 'positions';
		sender: Blade;
	};
	dispose: {
		sender: Blade;
	};
}

export class Blade {
	public readonly emitter: Emitter<BladeEvents> = new Emitter();
	private disposable_ = new Disposable();
	private positions_: BladePosition[] = [];

	constructor() {
		this.onDispose_ = this.onDispose_.bind(this);
		this.disposable_.emitter.on('dispose', this.onDispose_);
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
