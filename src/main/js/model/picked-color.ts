import {ColorMode} from '../misc/color-model';
import {Emitter, EventTypeMap} from '../misc/emitter';
import {Color} from './color';
import {InputValue} from './input-value';

/**
 * @hidden
 */
export interface PickedColorEvents extends EventTypeMap {
	change: {
		propertyName: 'mode' | 'value';
		sender: PickedColor;
	};
	dispose: {
		sender: PickedColor;
	};
}

export class PickedColor {
	public readonly emitter: Emitter<PickedColorEvents>;
	public readonly value: InputValue<Color>;
	private mode_: ColorMode;

	constructor(value: InputValue<Color>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.mode_ = 'rgb';
		this.value = value;

		this.emitter = new Emitter();
	}

	get mode(): ColorMode {
		return this.mode_;
	}

	set mode(mode: ColorMode) {
		if (this.mode_ === mode) {
			return;
		}

		this.mode_ = mode;
		this.emitter.emit('change', {
			propertyName: 'mode',
			sender: this,
		});
	}

	private onValueChange_(): void {
		this.emitter.emit('change', {
			propertyName: 'value',
			sender: this,
		});
	}
}
