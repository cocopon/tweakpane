import * as ColorConverter from '../../converter/color';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {NumberUtil} from '../../misc/number-util';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {Value} from '../../model/value';
import {View, ViewConfig} from '../view';

const className = ClassName('apl', 'input');

interface Config extends ViewConfig {
	value: Value<Color>;
}

/**
 * @hidden
 */
export class APaletteView extends View {
	public readonly value: Value<Color>;
	private colorElem_: HTMLDivElement | null;
	private markerElem_: HTMLDivElement | null;
	private previewElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element.classList.add(className());
		this.element.tabIndex = 0;

		const barElem = document.createElement('div');
		barElem.classList.add(className('b'));
		this.element.appendChild(barElem);

		const colorElem = document.createElement('div');
		colorElem.classList.add(className('c'));
		barElem.appendChild(colorElem);
		this.colorElem_ = colorElem;

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
			this.colorElem_ = DisposingUtil.disposeElement(this.colorElem_);
			this.markerElem_ = DisposingUtil.disposeElement(this.markerElem_);
		});
	}

	public update(): void {
		if (!this.markerElem_ || !this.previewElem_ || !this.colorElem_) {
			throw PaneError.alreadyDisposed();
		}

		const c = this.value.rawValue;
		const rgbaComps = c.getComponents('rgb');
		const leftColor = new Color(
			[rgbaComps[0], rgbaComps[1], rgbaComps[2], 0],
			'rgb',
		);
		const rightColor = new Color(
			[rgbaComps[0], rgbaComps[1], rgbaComps[2], 255],
			'rgb',
		);
		const gradientComps = [
			'to right',
			ColorConverter.toFunctionalRgbaString(leftColor),
			ColorConverter.toFunctionalRgbaString(rightColor),
		];
		this.colorElem_.style.background = `linear-gradient(${gradientComps.join(
			',',
		)})`;

		this.previewElem_.style.backgroundColor = ColorConverter.toFunctionalRgbaString(
			c,
		);
		const left = NumberUtil.map(rgbaComps[3], 0, 1, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
