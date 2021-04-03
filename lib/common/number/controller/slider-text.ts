import {ValueController} from '../../controller/value';
import {Formatter} from '../../converter/formatter';
import {Parser} from '../../converter/parser';
import {Value} from '../../model/value';
import {ViewProps} from '../../model/view-props';
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
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SliderTextController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: SliderTextView;
	public readonly viewProps: ViewProps;
	private sliderC_: SliderController;
	private textC_: NumberTextController;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.sliderC_ = new SliderController(doc, {
			baseStep: config.baseStep,
			props: config.sliderProps,
			value: config.value,
			viewProps: this.viewProps,
		});
		this.textC_ = new NumberTextController(doc, {
			baseStep: config.baseStep,
			draggingScale: config.draggingScale,
			formatter: config.formatter,
			parser: config.parser,
			value: config.value,
			viewProps: config.viewProps,
		});

		this.view = new SliderTextView(doc, {
			sliderView: this.sliderC_.view,
			textView: this.textC_.view,
		});
	}

	public sliderController(): SliderController {
		return this.sliderC_;
	}

	public textController(): NumberTextController {
		return this.textC_;
	}
}
