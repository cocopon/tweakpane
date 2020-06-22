import * as ColorConverter from '../../converter/color';
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
	private previewElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element.classList.add(className());
		this.element.tabIndex = 0;

		const canvasElem = document.createElement('canvas');
		canvasElem.classList.add(className('c'));
		this.element.appendChild(canvasElem);
		this.canvasElem_ = canvasElem;

		const markerElem = document.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		const previewElem = document.createElement('div');
		previewElem.classList.add(className('p'));
		this.markerElem_.appendChild(previewElem);
		this.previewElem_ = previewElem;

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
		if (!this.markerElem_ || !this.previewElem_) {
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
		const cw = Math.ceil(width / cellCount);
		for (let ix = 0; ix < cellCount; ix++) {
			const alpha = NumberUtil.map(ix, 0, cellCount - 1, 0, 1);
			ctx.fillStyle = ColorConverter.toFunctionalRgbaString(
				new Color(
					ColorModel.withAlpha(ColorModel.withoutAlpha(hsvComps), alpha),
					'hsv',
				),
			);

			const x = Math.floor(NumberUtil.map(ix, 0, cellCount - 1, 0, width - cw));
			const nx =
				ix < cellCount - 1
					? Math.floor(NumberUtil.map(ix + 1, 0, cellCount - 1, 0, width - cw))
					: width;
			ctx.fillRect(x, 0, nx - x, height);
		}

		this.previewElem_.style.backgroundColor = ColorConverter.toFunctionalRgbaString(
			c,
		);
		const left = NumberUtil.map(hsvComps[3], 0, 1, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
