import {Emitter} from '../../../common/model/emitter';
import {Value} from '../../../common/model/value';
import {Color} from './color';
import {ColorMode} from './color-model';

/**
 * @hidden
 */
export interface PickedColorEvents {
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
	public readonly value: Value<Color>;
	private mode_: ColorMode;

	constructor(value: Value<Color>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.mode_ = value.rawValue.mode;
		this.value = value;
		this.value.emitter.on('change', this.onValueChange_);

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
