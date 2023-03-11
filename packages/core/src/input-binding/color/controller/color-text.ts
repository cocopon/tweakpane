import {Constraint} from '../../../common/constraint/constraint';
import {DefiniteRangeConstraint} from '../../../common/constraint/definite-range';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {createNumberFormatter} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {connectValues} from '../../../common/model/value-sync';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {Tuple3} from '../../../misc/type-util';
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
import {ColorTextView} from '../view/color-text';

interface Config {
	colorType: ColorType;
	parser: Parser<number>;
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

/**
 * @hidden
 */
export class ColorTextController
	implements ValueController<IntColor, ColorTextView>
{
	public readonly colorMode: Value<ColorMode>;
	public readonly value: Value<IntColor>;
	public readonly view: ColorTextView;
	public readonly viewProps: ViewProps;
	private readonly parser_: Parser<number>;
	private readonly colorType_: ColorType;
	private ccs_: Tuple3<NumberTextController>;

	constructor(doc: Document, config: Config) {
		this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);

		this.colorType_ = config.colorType;
		this.parser_ = config.parser;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.colorMode = createValue(this.value.rawValue.mode);
		this.ccs_ = this.createComponentControllers_(doc);

		this.view = new ColorTextView(doc, {
			colorMode: this.colorMode,
			textViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
			viewProps: this.viewProps,
		});
		this.view.modeSelectElement.addEventListener(
			'change',
			this.onModeSelectChange_,
		);
	}

	private createComponentControllers_(
		doc: Document,
	): [NumberTextController, NumberTextController, NumberTextController] {
		const cc = {
			colorMode: this.colorMode.rawValue,
			colorType: this.colorType_,
			parser: this.parser_,
			viewProps: this.viewProps,
		};
		const ccs: Tuple3<NumberTextController> = [
			createComponentController(doc, cc, 0),
			createComponentController(doc, cc, 1),
			createComponentController(doc, cc, 2),
		];
		ccs.forEach((cs, index) => {
			connectValues({
				primary: this.value,
				secondary: cs.value,
				forward: (p) => {
					const mc = mapColorType(p.rawValue, this.colorType_);
					return mc.getComponents(this.colorMode.rawValue)[index];
				},
				backward: (p, s) => {
					const pickedMode = this.colorMode.rawValue;
					const mc = mapColorType(p.rawValue, this.colorType_);
					const comps = mc.getComponents(pickedMode);
					comps[index] = s.rawValue;
					const c = createColor(
						appendAlphaComponent(removeAlphaComponent(comps), comps[3]),
						pickedMode,
						this.colorType_,
					);
					return mapColorType(c, 'int');
				},
			});
		});
		return ccs;
	}

	private onModeSelectChange_(ev: Event) {
		const selectElem = ev.currentTarget as HTMLSelectElement;
		this.colorMode.rawValue = selectElem.value as ColorMode;

		this.ccs_ = this.createComponentControllers_(
			this.view.element.ownerDocument,
		);
		this.view.textViews = [
			this.ccs_[0].view,
			this.ccs_[1].view,
			this.ccs_[2].view,
		];
	}
}
