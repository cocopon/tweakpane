import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
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
}

/**
 * @hidden
 */
export class SliderTextController implements ValueController<number> {
	private sliderIc_: SliderController;
	private textIc_: NumberTextController;
	private value_: Value<number>;
	private view_: SliderTextView;

	constructor(doc: Document, config: Config) {
		this.value_ = config.value;

		this.sliderIc_ = new SliderController(doc, {
			baseStep: config.baseStep,
			value: config.value,
		});
		this.textIc_ = new NumberTextController(doc, {
			baseStep: config.baseStep,
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
		});

		this.view_ = new SliderTextView(doc, {
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
