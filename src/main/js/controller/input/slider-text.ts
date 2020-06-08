import {Formatter} from '../../formatter/formatter';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {Parser} from '../../parser/parser';
import {SliderTextInputView} from '../../view/input/slider-text';
import {InputController} from './input';
import {NumberTextInputController} from './number-text';
import {SliderInputController} from './slider';

interface Config {
	formatter: Formatter<number>;
	parser: Parser<string, number>;
	value: InputValue<number>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SliderTextInputController implements InputController<number> {
	public viewModel: ViewModel;
	private sliderIc_: SliderInputController;
	private textIc_: NumberTextInputController;
	private value_: InputValue<number>;
	private view_: SliderTextInputView;

	constructor(document: Document, config: Config) {
		this.value_ = config.value;

		this.viewModel = config.viewModel;
		this.sliderIc_ = new SliderInputController(document, {
			value: config.value,
			viewModel: this.viewModel,
		});
		this.textIc_ = new NumberTextInputController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
			viewModel: this.viewModel,
		});

		this.view_ = new SliderTextInputView(document, {
			model: this.viewModel,
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
