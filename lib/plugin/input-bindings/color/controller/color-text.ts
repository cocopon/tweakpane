import {Constraint} from '../../../common/constraint/constraint';
import {RangeConstraint} from '../../../common/constraint/range';
import {ValueController} from '../../../common/controller/value';
import {createNumberFormatter} from '../../../common/converter/number';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {NumberTextController} from '../../number/controller/number-text';
import {Color} from '../model/color';
import {
	appendAlphaComponent,
	ColorMode,
	convertColorMode,
	removeAlphaComponent,
} from '../model/color-model';
import {PickedColor} from '../model/picked-color';
import {getBaseStepForColor} from '../util';
import {ColorTextView} from '../view/color-text';

interface Config {
	parser: Parser<number>;
	pickedColor: PickedColor;
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
	},
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
		baseStep: getBaseStepForColor(false),
		draggingScale: 1,
		formatter: FORMATTER,
		parser: config.parser,
		value: new Value(0, {
			constraint: MODE_TO_CONSTRAINT_MAP[config.colorMode](index),
		}),
	});
}

/**
 * @hidden
 */
export class ColorTextController implements ValueController<Color> {
	public readonly pickedColor: PickedColor;
	public readonly view: ColorTextView;
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
					const rawMode = p.rawValue.mode;
					const pickedMode = this.pickedColor.mode;
					const comps = p.rawValue.getComponents(pickedMode);
					comps[index] = s.rawValue;
					const newComps = convertColorMode(
						removeAlphaComponent(comps),
						pickedMode,
						rawMode,
					);
					return new Color(appendAlphaComponent(newComps, comps[3]), rawMode);
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
