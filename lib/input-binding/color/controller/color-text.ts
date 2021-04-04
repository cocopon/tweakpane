import {Constraint} from '../../../common/constraint/constraint';
import {RangeConstraint} from '../../../common/constraint/range';
import {ValueController} from '../../../common/controller/value';
import {createNumberFormatter} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {BoundValue} from '../../../common/model/bound-value';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {connectValues} from '../../../common/model/value-sync';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {Color} from '../model/color';
import {
	appendAlphaComponent,
	ColorMode,
	removeAlphaComponent,
} from '../model/color-model';
import {PickedColor} from '../model/picked-color';
import {getBaseStepForColor} from '../util';
import {ColorTextView} from '../view/color-text';

interface Config {
	parser: Parser<number>;
	pickedColor: PickedColor;
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
		props: new ValueMap({
			draggingScale: 1,
			formatter: FORMATTER,
		}),
		value: new BoundValue(0, {
			constraint: MODE_TO_CONSTRAINT_MAP[config.colorMode](index),
		}),
		viewProps: config.viewProps,
	});
}

/**
 * @hidden
 */
export class ColorTextController implements ValueController<Color> {
	public readonly pickedColor: PickedColor;
	public readonly view: ColorTextView;
	public readonly viewProps: ViewProps;
	private parser_: Parser<number>;
	private ccs_: [
		NumberTextController,
		NumberTextController,
		NumberTextController,
	];

	constructor(doc: Document, config: Config) {
		this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);

		this.parser_ = config.parser;
		this.pickedColor = config.pickedColor;
		this.viewProps = config.viewProps;

		this.ccs_ = this.createComponentControllers_(doc);

		this.view = new ColorTextView(doc, {
			pickedColor: this.pickedColor,
			textViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
		});
		this.view.modeSelectElement.addEventListener(
			'change',
			this.onModeSelectChange_,
		);
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	private createComponentControllers_(
		doc: Document,
	): [NumberTextController, NumberTextController, NumberTextController] {
		const cc = {
			colorMode: this.pickedColor.mode,
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
					return p.rawValue.getComponents(this.pickedColor.mode)[index];
				},
				backward: (p, s) => {
					const pickedMode = this.pickedColor.mode;
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
		this.pickedColor.mode = selectElem.value as ColorMode;

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
