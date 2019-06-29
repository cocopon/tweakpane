import * as ColorModel from '../../misc/color-model';
import NumberUtil from '../../misc/number-util';
import PointerHandler from '../../misc/pointer-handler';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import SvPaletteInputView from '../../view/input/sv-palette';

import {PointerData} from '../../misc/pointer-handler';
import {InputController} from './input';

interface Config {
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export default class SvPaletteInputController
	implements InputController<Color> {
	public readonly value: InputValue<Color>;
	public readonly view: SvPaletteInputView;
	private ptHandler_: PointerHandler;

	constructor(document: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;

		this.view = new SvPaletteInputView(document, {
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.canvasElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);
	}

	public dispose(): void {
		this.view.dispose();
	}

	private handlePointerEvent_(d: PointerData): void {
		const saturation = NumberUtil.map(d.px, 0, 1, 0, 100);
		const value = NumberUtil.map(d.py, 0, 1, 100, 0);

		const c = this.value.rawValue;
		const [h] = ColorModel.rgbToHsv(...c.getComponents());
		this.value.rawValue = new Color(
			...ColorModel.hsvToRgb(h, saturation, value),
		);
		this.view.update();
	}

	private onPointerDown_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}

	private onPointerMove_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}

	private onPointerUp_(d: PointerData): void {
		this.handlePointerEvent_(d);
	}
}
