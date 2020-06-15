import {ColorFormatter} from '../../formatter/color';
import {ClassName} from '../../misc/class-name';
import * as ColorModel from '../../misc/color-model';
import * as DisposingUtil from '../../misc/disposing-util';
import * as DomUtil from '../../misc/dom-util';
import {NumberUtil} from '../../misc/number-util';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {View, ViewConfig} from '../view';

const className = ClassName('apl', 'input');

interface Config extends ViewConfig {
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export class APaletteInputView extends View {
	public readonly value: InputValue<Color>;
	private canvasElem_: HTMLCanvasElement | null;
	private markerElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element.classList.add(className());

		const canvasElem = document.createElement('canvas');
		canvasElem.classList.add(className('c'));
		canvasElem.tabIndex = -1;
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
		ctx.clearRect(0, 0, width, height);

		const c = this.value.rawValue;
		const hsvComps = c.getComponents('hsv');

		const cellCount = 64;
		const ch = Math.ceil(height / cellCount);
		for (let iy = 0; iy < cellCount; iy++) {
			const alpha = NumberUtil.map(iy, 0, cellCount - 1, 1, 0);
			const rgbComps = ColorModel.hsvToRgb(
				hsvComps[0],
				hsvComps[1],
				hsvComps[2],
			);
			ctx.fillStyle = ColorFormatter.rgb(
				rgbComps[0],
				rgbComps[1],
				rgbComps[2],
				alpha,
			);

			const y = Math.floor(
				NumberUtil.map(iy, 0, cellCount - 1, 0, height - ch),
			);
			const ny = Math.floor(
				NumberUtil.map(iy + 1, 0, cellCount - 1, 0, height - ch),
			);
			ctx.fillRect(0, y, width, ny - y);
		}

		const top = NumberUtil.map(hsvComps[3], 0, 1, 100, 0);
		this.markerElem_.style.top = `${top}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
