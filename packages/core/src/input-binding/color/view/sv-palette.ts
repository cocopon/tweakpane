import {getCanvasContext} from '../../../common/dom-util.js';
import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {mapRange} from '../../../common/number/util.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {hsvToRgbInt} from '../model/color-model.js';
import {IntColor} from '../model/int-color.js';

const cn = ClassName('svp');

interface Config {
	value: Value<IntColor>;
	viewProps: ViewProps;
}

const CANVAS_RESOL = 64;

/**
 * @hidden
 */
export class SvPaletteView implements View {
	public readonly element: HTMLElement;
	public readonly value: Value<IntColor>;
	public readonly canvasElement: HTMLCanvasElement;
	private readonly markerElem_: HTMLDivElement;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);
		config.viewProps.bindTabIndex(this.element);

		const canvasElem = doc.createElement('canvas');
		canvasElem.height = CANVAS_RESOL;
		canvasElem.width = CANVAS_RESOL;
		canvasElem.classList.add(cn('c'));
		this.element.appendChild(canvasElem);
		this.canvasElement = canvasElem;

		const markerElem = doc.createElement('div');
		markerElem.classList.add(cn('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.update_();
	}

	private update_(): void {
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
				const s = mapRange(ix, 0, width, 0, 100);
				const v = mapRange(iy, 0, height, 100, 0);
				const rgbComps = hsvToRgbInt(hsvComps[0], s, v);
				const i = (iy * width + ix) * 4;
				data[i] = rgbComps[0];
				data[i + 1] = rgbComps[1];
				data[i + 2] = rgbComps[2];
				data[i + 3] = 255;
			}
		}
		ctx.putImageData(imgData, 0, 0);

		const left = mapRange(hsvComps[1], 0, 100, 0, 100);
		this.markerElem_.style.left = `${left}%`;
		const top = mapRange(hsvComps[2], 0, 100, 100, 0);
		this.markerElem_.style.top = `${top}%`;
	}

	private onValueChange_(): void {
		this.update_();
	}
}
