import {disposeElement} from '../../../common/disposing-util';
import {getCanvasContext} from '../../../common/dom-util';
import {Color} from '../../../common/model/color';
import {hsvToRgb} from '../../../common/model/color-model';
import {Value} from '../../../common/model/value';
import * as NumberUtil from '../../../common/number-util';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {View, ViewConfig} from '../../../common/view/view';

const className = ClassName('svp');

interface Config extends ViewConfig {
	value: Value<Color>;
}

const CANVAS_RESOL = 64;

/**
 * @hidden
 */
export class SvPaletteView extends View {
	public readonly value: Value<Color>;
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
		canvasElem.height = CANVAS_RESOL;
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
			this.canvasElem_ = disposeElement(this.canvasElem_);
			this.markerElem_ = disposeElement(this.markerElem_);
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

		const ctx = getCanvasContext(this.canvasElement);
		if (!ctx) {
			return;
		}

		const c = this.value.rawValue;
		const hsvComps = c.getComponents('hsv');
		const width = this.canvasElement.width;
		const height = this.canvasElement.height;
		const imgData = ctx.getImageData(0, 0, width, height);
		const data = imgData.data;

		for (let iy = 0; iy < height; iy++) {
			for (let ix = 0; ix < width; ix++) {
				const s = NumberUtil.map(ix, 0, width, 0, 100);
				const v = NumberUtil.map(iy, 0, height, 100, 0);
				const rgbComps = hsvToRgb(hsvComps[0], s, v);
				const i = (iy * width + ix) * 4;
				data[i] = rgbComps[0];
				data[i + 1] = rgbComps[1];
				data[i + 2] = rgbComps[2];
				data[i + 3] = 255;
			}
		}
		ctx.putImageData(imgData, 0, 0);

		const left = NumberUtil.map(hsvComps[1], 0, 100, 0, 100);
		this.markerElem_.style.left = `${left}%`;
		const top = NumberUtil.map(hsvComps[2], 0, 100, 100, 0);
		this.markerElem_.style.top = `${top}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
