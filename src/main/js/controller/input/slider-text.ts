import {Formatter} from '../../formatter/formatter';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {Parser} from '../../parser/parser';
import {SliderTextInputView} from '../../view/input/slider-text';
import {ControllerConfig} from '../controller';
import {InputController} from './input';
import {NumberTextInputController} from './number-text';
import {SliderInputController} from './slider';

interface Config extends ControllerConfig {
	formatter: Formatter<number>;
	parser: Parser<string, number>;
	value: InputValue<number>;
}

/**
 * @hidden
 */
export class SliderTextInputController implements InputController<number> {
	public disposable: Disposable;
	private sliderIc_: SliderInputController;
	private textIc_: NumberTextInputController;
	private value_: InputValue<number>;
	private view_: SliderTextInputView;

	constructor(document: Document, config: Config) {
		this.value_ = config.value;

		this.disposable = config.disposable;
		this.sliderIc_ = new SliderInputController(document, {
			disposable: this.disposable,
			value: config.value,
		});
		this.textIc_ = new NumberTextInputController(document, {
			disposable: this.disposable,
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
		});

		this.view_ = new SliderTextInputView(document, {
			disposable: this.disposable,
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
