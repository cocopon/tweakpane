// @flow

import * as ColorModel from '../../misc/color-model';
import NumberUtil from '../../misc/number-util';
import PointerHandler from '../../misc/pointer-handler';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import HPaletteInputView from '../../view/input/h-palette';

import type {PointerData} from '../../misc/pointer-handler';
import type {InputController} from './input';

type Config = {
	value: InputValue<Color>,
};

export default class HPaletteInputController implements InputController<Color> {
	+value: InputValue<Color>;
	+view: HPaletteInputView;
	ptHandler_: PointerHandler;

	constructor(document: Document, config: Config) {
		(this: any).onPointerDown_ = this.onPointerDown_.bind(this);
		(this: any).onPointerMove_ = this.onPointerMove_.bind(this);
		(this: any).onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;

		this.view = new HPaletteInputView(document, {
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.canvasElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);
	}

	handlePointerEvent_(d: PointerData): void {
		const hue = NumberUtil.map(d.py, 0, 1, 0, 360);

		const c = this.value.rawValue;
		const [, s, v] = ColorModel.rgbToHsv(...c.getComponents());
		this.value.rawValue = new Color(...ColorModel.hsvToRgb(hue, s, v));
		this.view.update();
	}

	onPointerDown_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}

	onPointerMove_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}

	onPointerUp_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}
}
