import ColorFormatter from '../../formatter/color';
import ClassName from '../../misc/class-name';
import * as ColorModel from '../../misc/color-model';
import * as DomUtil from '../../misc/dom-util';
import NumberUtil from '../../misc/number-util';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import View from '../view';

const className = ClassName('svp', 'input');

interface Config {
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export default class SvPaletteInputView extends View {
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

		const c = this.value.rawValue;
		const hsvComps = ColorModel.rgbToHsv(...c.getComponents());
		const width = this.canvasElement.width;
		const height = this.canvasElement.height;

		const cellCount = 64;
		const cw = Math.ceil(width / cellCount);
		const ch = Math.ceil(height / cellCount);
		for (let iy = 0; iy < cellCount; iy++) {
			for (let ix = 0; ix < cellCount; ix++) {
				const s = NumberUtil.map(ix, 0, cellCount - 1, 0, 100);
				const v = NumberUtil.map(iy, 0, cellCount - 1, 100, 0);
				const rgbComps = ColorModel.hsvToRgb(hsvComps[0], s, v);
				ctx.fillStyle = ColorFormatter.rgb(...rgbComps);

				const x = Math.floor(
					NumberUtil.map(ix, 0, cellCount - 1, 0, width - cw),
				);
				const y = Math.floor(
					NumberUtil.map(iy, 0, cellCount - 1, 0, height - ch),
				);
				ctx.fillRect(x, y, cw, ch);
			}
		}

		const left = NumberUtil.map(hsvComps[1], 0, 100, 0, 100);
		this.markerElem_.style.left = `${left}%`;
		const top = NumberUtil.map(hsvComps[2], 0, 100, 100, 0);
		this.markerElem_.style.top = `${top}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
