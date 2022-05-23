import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {colorToFunctionalRgbString} from '../converter/color-string';
import {Color} from '../model/color';

const className = ClassName('hpl');

interface Config {
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class HPaletteView implements View {
	public readonly element: HTMLElement;
	public readonly value: Value<Color>;
	private readonly markerElem_: HTMLDivElement;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindTabIndex(this.element);

		const colorElem = doc.createElement('div');
		colorElem.classList.add(className('c'));
		this.element.appendChild(colorElem);

		const markerElem = doc.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.update_();
	}

	private update_(): void {
		const c = this.value.rawValue;
		const [h] = c.getComponents('hsv');
		this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(
			new Color([h, 100, 100], 'hsv'),
		);
		const left = mapRange(h, 0, 360, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update_();
	}
}
