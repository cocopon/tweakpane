import {Constraint} from '../../../common/constraint/constraint';
import {DefiniteRangeConstraint} from '../../../common/constraint/definite-range';
import {TextController} from '../../../common/controller/text';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {connectValues} from '../../../common/model/value-sync';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {InputView} from '../../../common/view/view';
import {
	colorToHexRgbString,
	createColorStringParser,
} from '../converter/color-string';
import {
	appendAlphaComponent,
	ColorMode,
	ColorType,
	getColorMaxComponents,
	removeAlphaComponent,
} from '../model/color-model';
import {createColor, mapColorType} from '../model/colors';
import {IntColor} from '../model/int-color';
import {getKeyScaleForColor} from '../util';
import {ColorTextsMode, ColorTextsView} from '../view/color-texts';

interface Config {
	colorType: ColorType;
	value: Value<IntColor>;
	viewProps: ViewProps;
}

function createFormatter(type: ColorType): Formatter<number> {
	return createNumberFormatter(type === 'float' ? 2 : 0);
}

function createConstraint(
	mode: ColorMode,
	type: ColorType,
	index: number,
): Constraint<number> {
	const max = getColorMaxComponents(mode, type)[index];
	return new DefiniteRangeConstraint({
		min: 0,
		max: max,
	});
}

function createComponentController(
	doc: Document,
	config: {
		colorMode: ColorMode;
		colorType: ColorType;
		parser: Parser<number>;
		viewProps: ViewProps;
	},
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
		parser: config.parser,
		props: ValueMap.fromObject({
			formatter: createFormatter(config.colorType),
			keyScale: getKeyScaleForColor(false),
			pointerScale: config.colorType === 'float' ? 0.01 : 1,
		}),
		value: createValue(0, {
			constraint: createConstraint(config.colorMode, config.colorType, index),
		}),
		viewProps: config.viewProps,
	});
}

function createComponentControllers(
	doc: Document,
	config: {
		colorMode: ColorMode;
		colorType: ColorType;
		value: Value<IntColor>;
		viewProps: ViewProps;
	},
): NumberTextController[] {
	const cc = {
		colorMode: config.colorMode,
		colorType: config.colorType,
		parser: parseNumber,
		viewProps: config.viewProps,
	};
	return [0, 1, 2].map((i) => {
		const c = createComponentController(doc, cc, i);
		connectValues({
			primary: config.value,
			secondary: c.value,
			forward(p) {
				const mc = mapColorType(p.rawValue, config.colorType);
				return mc.getComponents(config.colorMode)[i];
			},
			backward(p, s) {
				const pickedMode = config.colorMode;
				const mc = mapColorType(p.rawValue, config.colorType);
				const comps = mc.getComponents(pickedMode);
				comps[i] = s.rawValue;
				const c = createColor(
					appendAlphaComponent(removeAlphaComponent(comps), comps[3]),
					pickedMode,
					config.colorType,
				);
				return mapColorType(c, 'int');
			},
		});
		return c;
	});
}

function createHexController(
	doc: Document,
	config: {
		value: Value<IntColor>;
		viewProps: ViewProps;
	},
) {
	const c = new TextController<IntColor>(doc, {
		parser: createColorStringParser('int'),
		props: ValueMap.fromObject({
			formatter: colorToHexRgbString,
		}),
		value: createValue(IntColor.black()),
		viewProps: config.viewProps,
	});

	connectValues({
		primary: config.value,
		secondary: c.value,
		forward: (p) => {
			const pc = p.rawValue;
			return new IntColor(removeAlphaComponent(pc.getComponents()), pc.mode);
		},
		backward: (p, s) => {
			const pc = p.rawValue;
			const sc = s.rawValue;
			return new IntColor(
				appendAlphaComponent(
					removeAlphaComponent(sc.getComponents(pc.mode)),
					pc.getComponents()[3],
				),
				pc.mode,
			);
		},
	});

	return [c] as ComponentValueController[];
}

function isColorMode(mode: ColorTextsMode): mode is ColorMode {
	return mode !== 'hex';
}

type ComponentValueController = ValueController<unknown, InputView>;

/**
 * @hidden
 */
export class ColorTextsController
	implements ValueController<IntColor, ColorTextsView>
{
	public readonly colorMode: Value<ColorTextsMode>;
	public readonly value: Value<IntColor>;
	public readonly view: ColorTextsView;
	public readonly viewProps: ViewProps;
	private readonly colorType_: ColorType;
	private ccs_: ComponentValueController[];

	constructor(doc: Document, config: Config) {
		this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);

		this.colorType_ = config.colorType;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.colorMode = createValue(this.value.rawValue.mode as ColorTextsMode);
		this.ccs_ = this.createComponentControllers_(doc);

		this.view = new ColorTextsView(doc, {
			mode: this.colorMode,
			inputViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
			viewProps: this.viewProps,
		});
		this.view.modeSelectElement.addEventListener(
			'change',
			this.onModeSelectChange_,
		);
	}

	private createComponentControllers_(
		doc: Document,
	): ComponentValueController[] {
		const mode = this.colorMode.rawValue;
		if (isColorMode(mode)) {
			return createComponentControllers(doc, {
				colorMode: mode,
				colorType: this.colorType_,
				value: this.value,
				viewProps: this.viewProps,
			}) as ComponentValueController[];
		}
		return createHexController(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
	}

	private onModeSelectChange_(ev: Event) {
		const selectElem = ev.currentTarget as HTMLSelectElement;
		this.colorMode.rawValue = selectElem.value as ColorMode;

		this.ccs_ = this.createComponentControllers_(
			this.view.element.ownerDocument,
		);
		this.view.inputViews = this.ccs_.map((cc) => cc.view);
	}
}
