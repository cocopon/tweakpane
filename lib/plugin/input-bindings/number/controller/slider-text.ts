import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {Parser} from '../../../common/reader/parser';
import {Formatter} from '../../../common/writer/formatter';
import {SliderTextView} from '../view/slider-text';
import {NumberTextController} from './number-text';
import {SliderController} from './slider';

interface Config {
	baseStep: number;
	formatter: Formatter<number>;
	parser: Parser<string, number>;
	value: Value<number>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SliderTextController implements ValueController<number> {
	public viewModel: ViewModel;
	private sliderIc_: SliderController;
	private textIc_: NumberTextController;
	private value_: Value<number>;
	private view_: SliderTextView;

	constructor(document: Document, config: Config) {
		this.value_ = config.value;

		this.viewModel = config.viewModel;
		this.sliderIc_ = new SliderController(document, {
			baseStep: config.baseStep,
			value: config.value,
			viewModel: this.viewModel,
		});
		this.textIc_ = new NumberTextController(document, {
			baseStep: config.baseStep,
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
			viewModel: this.viewModel,
		});

		this.view_ = new SliderTextView(document, {
			model: this.viewModel,
			sliderView: this.sliderIc_.view,
			textView: this.textIc_.view,
		});
	}

	get value(): Value<number> {
		return this.value_;
	}

	get view(): SliderTextView {
		return this.view_;
	}
}