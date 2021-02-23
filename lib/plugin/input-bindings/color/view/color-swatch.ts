import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {colorToHexRgbaString} from '../converter/color-string';
import {Color} from '../model/color';
import {ColorPickerView} from './color-picker';

interface Config {
	pickerView: ColorPickerView;
	value: Value<Color>;
}

const className = ClassName('csw');

/**
 * @hidden
 */
export class ColorSwatchView implements ValueView<Color> {
	public readonly element: HTMLElement;
	public readonly value: Value<Color>;
	private pickerView_: ColorPickerView;
	public readonly buttonElement: HTMLButtonElement;
	private swatchElem_: HTMLDivElement;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const swatchElem = doc.createElement('div');
		swatchElem.classList.add(className('sw'));
		this.element.appendChild(swatchElem);
		this.swatchElem_ = swatchElem;

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const pickerElem = doc.createElement('div');
		pickerElem.classList.add(className('p'));
		this.pickerView_ = config.pickerView;
		pickerElem.appendChild(this.pickerView_.element);
		this.element.appendChild(pickerElem);

		this.update();
	}

	public update(): void {
		const value = this.value.rawValue;
		this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
	}

	private onValueChange_(): void {
		this.update();
	}
}
