import * as ColorConverter from '../../converter/color';
import ClassName from '../../misc/class-name';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import View from '../view';
import ColorPickerInputView from './color-picker';

import {InputView} from './input';

interface Config {
	pickerInputView: ColorPickerInputView;
	value: InputValue<Color>;
}

const className = ClassName('csw', 'input');

/**
 * @hidden
 */
export default class ColorSwatchInputView extends View
	implements InputView<Color> {
	public readonly value: InputValue<Color>;
	private pickerView_: ColorPickerInputView;
	private buttonElem_: HTMLButtonElement;
	private swatchElem_: HTMLDivElement;

	constructor(document: Document, config: Config) {
		super(document);

		this.onValueChange_ = this.onValueChange_.bind(this);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('sw'));
		this.element.appendChild(swatchElem);
		this.swatchElem_ = swatchElem;

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		this.element.appendChild(buttonElem);
		this.buttonElem_ = buttonElem;

		const pickerElem = document.createElement('div');
		pickerElem.classList.add(className('p'));
		this.pickerView_ = config.pickerInputView;
		pickerElem.appendChild(this.pickerView_.element);
		this.element.appendChild(pickerElem);

		this.update();
	}

	get buttonElement(): HTMLButtonElement {
		return this.buttonElem_;
	}

	public update(): void {
		const value = this.value.rawValue;
		this.swatchElem_.style.backgroundColor = ColorConverter.toString(value);
	}

	private onValueChange_(): void {
		this.update();
	}
}
