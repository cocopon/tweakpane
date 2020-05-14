import {ClassName} from '../../misc/class-name';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ColorSwatchInputView} from '../input/color-swatch';
import {View, ViewConfig} from '../view';
import {InputView} from './input';
import {TextInputView} from './text';

interface Config extends ViewConfig {
	swatchInputView: ColorSwatchInputView;
	textInputView: TextInputView<Color>;
}

const className = ClassName('cswtxt', 'input');

/**
 * @hidden
 */
export class ColorSwatchTextInputView extends View implements InputView<Color> {
	public readonly textInputView: TextInputView<Color>;
	private readonly swatchInputView_: ColorSwatchInputView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('s'));
		this.swatchInputView_ = config.swatchInputView;
		swatchElem.appendChild(this.swatchInputView_.element);
		this.element.appendChild(swatchElem);

		const textElem = document.createElement('div');
		textElem.classList.add(className('t'));
		this.textInputView = config.textInputView;
		textElem.appendChild(this.textInputView.element);
		this.element.appendChild(textElem);
	}

	get value(): InputValue<Color> {
		return this.textInputView.value;
	}

	public update(): void {
		this.swatchInputView_.update();
		this.textInputView.update();
	}
}
