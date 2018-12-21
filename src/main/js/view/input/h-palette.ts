// @flow

import ColorFormatter from '../../formatter/color';
import ClassName from '../../misc/class-name';
import * as ColorModel from '../../misc/color-model';
import * as DomUtil from '../../misc/dom-util';
import NumberUtil from '../../misc/number-util';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import View from '../view';

const className = ClassName('hpl', 'input');

interface Config {
	value: InputValue<Color>;
}

export default class HPaletteInputView extends View {
	public readonly canvasElement: HTMLCanvasElement;
	public readonly value: InputValue<Color>;
	private markerElem_: HTMLDivElement;

	constructor(document: Document, config: Config) {
		super(document);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element.classList.add(className());

		const canvasElem = document.createElement('canvas');
		canvasElem.classList.add(className('c'));
		canvasElem.tabIndex = -1;
		this.element.appendChild(canvasElem);
		this.canvasElement = canvasElem;

		const markerElem = document.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.update();
	}

	public update(): void {
		const ctx = DomUtil.getCanvasContext(this.canvasElement);
		if (!ctx) {
			return;
		}

		const width = this.canvasElement.width;
		const height = this.canvasElement.height;

		const cellCount = 64;
		const ch = Math.ceil(height / cellCount);
		for (let iy = 0; iy < cellCount; iy++) {
			const hue = NumberUtil.map(iy, 0, cellCount - 1, 0, 360);
			const rgbComps = ColorModel.hsvToRgb(hue, 100, 100);
			ctx.fillStyle = ColorFormatter.rgb(...rgbComps);

			const y = Math.floor(
				NumberUtil.map(iy, 0, cellCount - 1, 0, height - ch),
			);
			ctx.fillRect(0, y, width, ch);
		}

		const c = this.value.rawValue;
		const hsvComps = ColorModel.rgbToHsv(...c.getComponents());
		const top = NumberUtil.map(hsvComps[0], 0, 360, 0, 100);
		this.markerElem_.style.top = `${top}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
