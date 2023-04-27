import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {mapRange} from '../../../common/number/util.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {colorToFunctionalRgbaString} from '../converter/color-string.js';
import {IntColor} from '../model/int-color.js';

const cn = ClassName('apl');

interface Config {
	value: Value<IntColor>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class APaletteView implements View {
	public readonly element: HTMLElement;
	public readonly value: Value<IntColor>;
	private readonly colorElem_: HTMLDivElement;
	private readonly markerElem_: HTMLDivElement;
	private readonly previewElem_: HTMLDivElement;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);
		config.viewProps.bindTabIndex(this.element);

		const barElem = doc.createElement('div');
		barElem.classList.add(cn('b'));
		this.element.appendChild(barElem);

		const colorElem = doc.createElement('div');
		colorElem.classList.add(cn('c'));
		barElem.appendChild(colorElem);
		this.colorElem_ = colorElem;

		const markerElem = doc.createElement('div');
		markerElem.classList.add(cn('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		const previewElem = doc.createElement('div');
		previewElem.classList.add(cn('p'));
		this.markerElem_.appendChild(previewElem);
		this.previewElem_ = previewElem;

		this.update_();
	}

	private update_(): void {
		const c = this.value.rawValue;
		const rgbaComps = c.getComponents('rgb');
		const leftColor = new IntColor(
			[rgbaComps[0], rgbaComps[1], rgbaComps[2], 0],
			'rgb',
		);
		const rightColor = new IntColor(
			[rgbaComps[0], rgbaComps[1], rgbaComps[2], 255],
			'rgb',
		);
		const gradientComps = [
			'to right',
			colorToFunctionalRgbaString(leftColor),
			colorToFunctionalRgbaString(rightColor),
		];
		this.colorElem_.style.background = `linear-gradient(${gradientComps.join(
			',',
		)})`;

		this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
		const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update_();
	}
}
