// @flow

import Color from '../../model/color';
import InputValue from '../../model/input-value';
import ColorSwatchTextInputView from '../../view/input/color-swatch-text';
import ColorSwatchInputController from '../input/color-swatch';
import TextInputController from './text';

import type {Formatter} from '../../formatter/formatter';
import type {Parser} from '../../parser/parser';
import type {InputController} from './input';

type Config = {
	formatter: Formatter<Color>,
	parser: Parser<Color>,
	value: InputValue<Color>,
};

export default class ColorSwatchTextInputController
	implements InputController<Color> {
	+value: InputValue<Color>;
	+view: ColorSwatchTextInputView;
	swatchIc_: ColorSwatchInputController;
	textIc_: TextInputController<Color>;

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
