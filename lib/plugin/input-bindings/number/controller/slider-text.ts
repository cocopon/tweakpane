import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Value} from '../../../common/model/value';
import {Parser} from '../../../common/reader/parser';
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
	public readonly value: Value<number>;
	public readonly view: SliderTextView;
	private sliderIc_: SliderController;
	private textIc_: NumberTextController;

	constructor(doc: Document, config: Config) {
		this.value = config.value;

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

		this.view = new SliderTextView(doc, {
			sliderView: this.sliderIc_.view,
			textView: this.textIc_.view,
		});
	}
}
