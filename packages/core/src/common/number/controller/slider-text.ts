import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../../blade/common/controller/blade-state.js';
import {ValueController} from '../../controller/value.js';
import {Formatter} from '../../converter/formatter.js';
import {Parser} from '../../converter/parser.js';
import {Value} from '../../model/value.js';
import {ValueMap} from '../../model/value-map.js';
import {createValue} from '../../model/values.js';
import {ViewProps} from '../../model/view-props.js';
import {NumberTextProps} from '../view/number-text.js';
import {SliderProps} from '../view/slider.js';
import {SliderTextView} from '../view/slider-text.js';
import {NumberTextController} from './number-text.js';
import {SliderController} from './slider.js';

/**
 * @hidden
 */
interface Config {
	parser: Parser<number>;
	sliderProps: SliderProps;
	textProps: NumberTextProps;
	value: Value<number>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SliderTextController
	implements ValueController<number, SliderTextView>, PropsPortable
{
	public readonly value: Value<number>;
	public readonly view: SliderTextView;
	public readonly viewProps: ViewProps;
	private readonly sliderC_: SliderController;
	private readonly textC_: NumberTextController;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.sliderC_ = new SliderController(doc, {
			props: config.sliderProps,
			value: config.value,
			viewProps: this.viewProps,
		});
		this.textC_ = new NumberTextController(doc, {
			parser: config.parser,
			props: config.textProps,
			sliderProps: config.sliderProps,
			value: config.value,
			viewProps: config.viewProps,
		});

		this.view = new SliderTextView(doc, {
			sliderView: this.sliderC_.view,
			textView: this.textC_.view,
		});
	}

	public get sliderController(): SliderController {
		return this.sliderC_;
	}

	public get textController(): NumberTextController {
		return this.textC_;
	}

	public importProps(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				max: p.required.number,
				min: p.required.number,
			}),
			(result) => {
				const sliderProps = this.sliderC_.props;
				sliderProps.set('max', result.max);
				sliderProps.set('min', result.min);
				return true;
			},
		);
	}

	public exportProps(): BladeState {
		const sliderProps = this.sliderC_.props;
		return exportBladeState(null, {
			max: sliderProps.get('max'),
			min: sliderProps.get('min'),
		});
	}
}

export function createSliderTextProps(config: {
	formatter: Formatter<number>;
	keyScale: Value<number>;
	max: Value<number>;
	min: Value<number>;
	pointerScale: number;
}): {
	sliderProps: SliderProps;
	textProps: NumberTextProps;
} {
	return {
		sliderProps: new ValueMap({
			keyScale: config.keyScale,
			max: config.max,
			min: config.min,
		}),
		textProps: new ValueMap({
			formatter: createValue(config.formatter),
			keyScale: config.keyScale,
			pointerScale: createValue(config.pointerScale),
		}),
	};
}
