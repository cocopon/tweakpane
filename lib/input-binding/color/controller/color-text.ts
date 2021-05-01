import {Constraint} from '../../../common/constraint/constraint';
import {RangeConstraint} from '../../../common/constraint/range';
import {Controller} from '../../../common/controller/controller';
import {createNumberFormatter} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {connectValues} from '../../../common/model/value-sync';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {Color} from '../model/color';
import {
	appendAlphaComponent,
	ColorMode,
	removeAlphaComponent,
} from '../model/color-model';
import {getBaseStepForColor} from '../util';
import {ColorTextView} from '../view/color-text';

interface Config {
	parser: Parser<number>;
	value: Value<Color>;
	viewProps: ViewProps;
}

const FORMATTER = createNumberFormatter(0);

const MODE_TO_CONSTRAINT_MAP: {
	[mode in ColorMode]: (index: number) => Constraint<number>;
} = {
	rgb: () => {
		return new RangeConstraint({min: 0, max: 255});
	},
	hsl: (index) => {
		return index === 0
			? new RangeConstraint({min: 0, max: 360})
			: new RangeConstraint({min: 0, max: 100});
	},
	hsv: (index) => {
		return index === 0
			? new RangeConstraint({min: 0, max: 360})
			: new RangeConstraint({min: 0, max: 100});
	},
};

function createComponentController(
	doc: Document,
	config: {
		colorMode: ColorMode;
		parser: Parser<number>;
		viewProps: ViewProps;
	},
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
		baseStep: getBaseStepForColor(false),
		parser: config.parser,
		props: ValueMap.fromObject({
			draggingScale: 1,
			formatter: FORMATTER,
		}),
		value: createValue(0, {
			constraint: MODE_TO_CONSTRAINT_MAP[config.colorMode](index),
		}),
		viewProps: config.viewProps,
	});
}

/**
 * @hidden
 */
export class ColorTextController implements Controller<ColorTextView> {
	public readonly colorMode: Value<ColorMode>;
	public readonly value: Value<Color>;
	public readonly view: ColorTextView;
	public readonly viewProps: ViewProps;
	private readonly parser_: Parser<number>;
	private ccs_: [
		NumberTextController,
		NumberTextController,
		NumberTextController,
	];

	constructor(doc: Document, config: Config) {
		this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.colorMode = createValue(this.value.rawValue.mode);
		this.ccs_ = this.createComponentControllers_(doc);

		this.view = new ColorTextView(doc, {
			colorMode: this.colorMode,
			textViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
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
			parser: this.parser_,
			viewProps: this.viewProps,
		};
		const ccs: [
			NumberTextController,
			NumberTextController,
			NumberTextController,
		] = [
			createComponentController(doc, cc, 0),
			createComponentController(doc, cc, 1),
			createComponentController(doc, cc, 2),
		];
		ccs.forEach((cs, index) => {
			connectValues({
				primary: this.value,
				secondary: cs.value,
				forward: (p) => {
					return p.rawValue.getComponents(this.colorMode.rawValue)[index];
				},
				backward: (p, s) => {
					const pickedMode = this.colorMode.rawValue;
					const comps = p.rawValue.getComponents(pickedMode);
					comps[index] = s.rawValue;
					return new Color(
						appendAlphaComponent(removeAlphaComponent(comps), comps[3]),
						pickedMode,
					);
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
