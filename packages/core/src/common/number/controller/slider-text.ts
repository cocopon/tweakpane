import {
	BladeState,
	BladeStatePortable,
	exportBladeState,
	importBladeState,
} from '../../../blade/common/controller/blade-state';
import {ValueController} from '../../controller/value';
import {Parser} from '../../converter/parser';
import {Value} from '../../model/value';
import {ViewProps} from '../../model/view-props';
import {NumberTextProps} from '../view/number-text';
import {SliderProps} from '../view/slider';
import {SliderTextView} from '../view/slider-text';
import {NumberTextController} from './number-text';
import {SliderController} from './slider';

/**
 * @hidden
 */
interface Config {
	baseStep: number;
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
	implements ValueController<number, SliderTextView>, BladeStatePortable
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
			baseStep: config.baseStep,
			props: config.sliderProps,
			value: config.value,
			viewProps: this.viewProps,
		});
		this.textC_ = new NumberTextController(doc, {
			baseStep: config.baseStep,
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

	public importState(state: BladeState): boolean {
		return importBladeState(
			state,
			() => true,
			(p) => ({
				disabled: p.required.boolean,
				hidden: p.required.boolean,
				max: p.required.number,
				min: p.required.number,
			}),
			(result) => {
				const sliderProps = this.sliderC_.props;
				sliderProps.set('max', result.max);
				sliderProps.set('min', result.min);
				this.viewProps.importState(result);
				return true;
			},
		);
	}

	public exportState(): BladeState {
		const sliderProps = this.sliderC_.props;
		return exportBladeState(() => ({}), {
			...this.viewProps.exportState(),
			max: sliderProps.get('max'),
			min: sliderProps.get('min'),
		});
	}
}
