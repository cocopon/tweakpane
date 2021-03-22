import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {SliderProps} from '../view/slider';
import {SliderTextView} from '../view/slider-text';
import {NumberTextController} from './number-text';
import {SliderController} from './slider';

interface Config {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
	parser: Parser<number>;
	sliderProps: SliderProps;
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
			props: config.sliderProps,
			value: config.value,
		});
		this.textIc_ = new NumberTextController(doc, {
			baseStep: config.baseStep,
			draggingScale: config.draggingScale,
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
