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
}

export class Blade {
	public readonly emitter: Emitter<BladeEvents> = new Emitter();
	private positions_: BladePosition[] = [];

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
}
