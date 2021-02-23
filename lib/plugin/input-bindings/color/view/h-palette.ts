import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {mapRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {colorToFunctionalRgbString} from '../converter/color-string';

const className = ClassName('hpl');

interface Config {
	value: Value<Color>;
}

/**
 * @hidden
 */
export class HPaletteView implements ValueView<Color> {
	public readonly element: HTMLElement;
	public readonly value: Value<Color>;
	private markerElem_: HTMLDivElement;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.value = config.value;
		this.value.emitter.on('change', this.onValueChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		this.element.tabIndex = 0;

		const colorElem = doc.createElement('div');
		colorElem.classList.add(className('c'));
		this.element.appendChild(colorElem);

		const markerElem = doc.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.update();
	}

	public update(): void {
		const c = this.value.rawValue;
		const [h] = c.getComponents('hsv');
		this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(
			new Color([h, 100, 100], 'hsv'),
		);
		const left = mapRange(h, 0, 360, 0, 100);
		this.markerElem_.style.left = `${left}%`;
	}

	private onValueChange_(): void {
		this.update();
	}
}
