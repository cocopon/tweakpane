import * as ColorConverter from '../../converter/color';
import {ClassName} from '../../misc/class-name';
import {hsvToRgb} from '../../misc/color-model';
import * as DisposingUtil from '../../misc/disposing-util';
import * as DomUtil from '../../misc/dom-util';
import {NumberUtil} from '../../misc/number-util';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {View, ViewConfig} from '../view';

const className = ClassName('hpl', 'input');

interface Config extends ViewConfig {
	value: InputValue<Color>;
}

const CANVAS_RESOL = 64;

/**
 * @hidden
 */
export class HPaletteInputView extends View {
	public readonly value: InputValue<Color>;
	private canvasElem_: HTMLCanvasElement | null;
	private markerElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element.classList.add(className());
		this.element.tabIndex = 0;

		const canvasElem = document.createElement('canvas');
		canvasElem.height = 1;
		canvasElem.width = CANVAS_RESOL;
		canvasElem.classList.add(className('c'));
		this.element.appendChild(canvasElem);
		this.canvasElem_ = canvasElem;

		const markerElem = document.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.canvasElem_ = DisposingUtil.disposeElement(this.canvasElem_);
			this.markerElem_ = DisposingUtil.disposeElement(this.markerElem_);
		});
	}

	get canvasElement(): HTMLCanvasElement {
		if (!this.canvasElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.canvasElem_;
	}

	public update(): void {
		if (!this.markerElem_) {
			throw PaneError.alreadyDisposed();
		}

		const ctx = DomUtil.getCanvasContext(this.canvasElement);
		if (!ctx) {
			return;
		}

		const width = this.canvasElement.width;
		const height = this.canvasElement.height;
		const imgData = ctx.getImageData(0, 0, width, height);
		const data = imgData.data;

		for (let ix = 0; ix < width; ix++) {
			const hue = NumberUtil.map(ix, 0, width, 0, 360);
			const rgbComps = hsvToRgb(hue, 100, 100);
			const i = ix * 4;
			data[i] = rgbComps[0];
			data[i + 1] = rgbComps[1];
			data[i + 2] = rgbComps[2];
			data[i + 3] = 255;
		}
		ctx.putImageData(imgData, 0, 0);

		const c = this.value.rawValue;
		const [h] = c.getComponents('hsv');
		this.markerElem_.style.backgroundColor = ColorConverter.toFunctionalRgbString(
			new Color([h, 100, 100], 'hsv'),
		);
		const left = NumberUtil.map(h, 0, 360, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
