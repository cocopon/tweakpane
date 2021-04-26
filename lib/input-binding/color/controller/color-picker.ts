import {RangeConstraint} from '../../../common/constraint/range';
import {ValueController} from '../../../common/controller/value';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {BoundValue} from '../../../common/model/bound-value';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {connectValues} from '../../../common/model/value-sync';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {Color} from '../model/color';
import {PickedColor} from '../model/picked-color';
import {ColorPickerView} from '../view/color-picker';
import {APaletteController} from './a-palette';
import {ColorTextController} from './color-text';
import {HPaletteController} from './h-palette';
import {SvPaletteController} from './sv-palette';

interface Config {
	pickedColor: PickedColor;
	supportsAlpha: boolean;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorPickerController implements ValueController<Color> {
	public readonly pickedColor: PickedColor;
	public readonly view: ColorPickerView;
	public readonly viewProps: ViewProps;
	private alphaIcs_: {
		palette: APaletteController;
		text: NumberTextController;
	} | null;
	private hPaletteC_: HPaletteController;
	private svPaletteC_: SvPaletteController;
	private textC_: ColorTextController;

	constructor(doc: Document, config: Config) {
		this.pickedColor = config.pickedColor;
		this.viewProps = config.viewProps;

		this.hPaletteC_ = new HPaletteController(doc, {
			value: this.pickedColor.value,
			viewProps: this.viewProps,
		});
		this.svPaletteC_ = new SvPaletteController(doc, {
			value: this.pickedColor.value,
			viewProps: this.viewProps,
		});
		this.alphaIcs_ = config.supportsAlpha
			? {
					palette: new APaletteController(doc, {
						value: this.pickedColor.value,
						viewProps: this.viewProps,
					}),
					text: new NumberTextController(doc, {
						parser: parseNumber,
						baseStep: 0.1,
						props: new ValueMap({
							draggingScale: 0.01,
							formatter: createNumberFormatter(2),
						}),
						value: new BoundValue(0, {
							constraint: new RangeConstraint({min: 0, max: 1}),
						}),
						viewProps: this.viewProps,
					}),
			  }
			: null;
		if (this.alphaIcs_) {
			connectValues({
				primary: this.pickedColor.value,
				secondary: this.alphaIcs_.text.value,
				forward: (p) => {
					return p.rawValue.getComponents()[3];
				},
				backward: (p, s) => {
					const comps = p.rawValue.getComponents();
					comps[3] = s.rawValue;
					return new Color(comps, p.rawValue.mode);
				},
			});
		}
		this.textC_ = new ColorTextController(doc, {
			parser: parseNumber,
			pickedColor: this.pickedColor,
			viewProps: this.viewProps,
		});

		this.view = new ColorPickerView(doc, {
			alphaViews: this.alphaIcs_
				? {
						palette: this.alphaIcs_.palette.view,
						text: this.alphaIcs_.text.view,
				  }
				: null,
			hPaletteView: this.hPaletteC_.view,
			supportsAlpha: config.supportsAlpha,
			svPaletteView: this.svPaletteC_.view,
			textView: this.textC_.view,
		});
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	get textController(): ColorTextController {
		return this.textC_;
	}
}
