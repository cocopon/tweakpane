import InputValue from '../../model/input-value';
import SliderTextInputView from '../../view/input/slider-text';
import NumberTextInputController from './number-text';
import SliderInputController from './slider';

import {Formatter} from '../../formatter/formatter';
import {Parser} from '../../parser/parser';
import {InputController} from './input';

interface Config {
	formatter: Formatter<number>;
	parser: Parser<number>;
	value: InputValue<number>;
}

/**
 * @hidden
 */
export default class SliderTextInputController
	implements InputController<number> {
	private sliderIc_: SliderInputController;
	private textIc_: NumberTextInputController;
	private value_: InputValue<number>;
	private view_: SliderTextInputView;

	constructor(document: Document, config: Config) {
		this.value_ = config.value;

		this.sliderIc_ = new SliderInputController(document, {
			value: config.value,
		});
		this.textIc_ = new NumberTextInputController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
		});

		this.view_ = new SliderTextInputView(document, {
			sliderInputView: this.sliderIc_.view,
			textInputView: this.textIc_.view,
		});
	}

	get value(): InputValue<number> {
		return this.value_;
	}

	get view(): SliderTextInputView {
		return this.view_;
	}
}
