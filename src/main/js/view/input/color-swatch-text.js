// @flow

import ClassName from '../../misc/class-name';
import InputValue from '../../model/input-value';
import ColorSwatchMonitorView from '../monitor/color-swatch';
import View from '../view';
import TextInputView from './text';

import type {Color} from '../../model/color';
import type {InputView} from './input';

type Config = {
	swatchMonitorView: ColorSwatchMonitorView,
	textInputView: TextInputView<Color>,
};

const className = ClassName('cswtxt', 'input');

export default class ColorSwatchTextInputView extends View implements InputView<Color> {
	swatchMonitorView_: ColorSwatchMonitorView;
	textInputView_: TextInputView<Color>;

	constructor(document: Document, config: Config) {
		super(document);

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('s'));
		this.swatchMonitorView_ = config.swatchMonitorView;
		swatchElem.appendChild(this.swatchMonitorView_.element);
		this.element.appendChild(swatchElem);

		const textElem = document.createElement('div');
		textElem.classList.add(className('t'));
		this.textInputView_ = config.textInputView;
		textElem.appendChild(this.textInputView_.element);
		this.element.appendChild(textElem);
	}

	get value(): InputValue<Color> {
		return this.textInputView_.value;
	}

	update(): void {
		this.swatchMonitorView_.update();
		this.textInputView_.update();
	}
}
