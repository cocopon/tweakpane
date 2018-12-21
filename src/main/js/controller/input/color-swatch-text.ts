// @flow

import Color from '../../model/color';
import InputValue from '../../model/input-value';
import ColorSwatchTextInputView from '../../view/input/color-swatch-text';
import ColorSwatchInputController from '../input/color-swatch';
import TextInputController from './text';

import {Formatter} from '../../formatter/formatter';
import {Parser} from '../../parser/parser';
import {InputController} from './input';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<Color>;
	value: InputValue<Color>;
}

export default class ColorSwatchTextInputController
	implements InputController<Color> {
	public readonly value: InputValue<Color>;
	public readonly view: ColorSwatchTextInputView;
	private swatchIc_: ColorSwatchInputController;
	private textIc_: TextInputController<Color>;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.swatchIc_ = new ColorSwatchInputController(document, {
			value: this.value,
		});

		this.textIc_ = new TextInputController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: this.value,
		});

		this.view = new ColorSwatchTextInputView(document, {
			swatchInputView: this.swatchIc_.view,
			textInputView: this.textIc_.view,
		});
	}
}
