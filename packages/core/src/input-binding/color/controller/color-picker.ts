import {DefiniteRangeConstraint} from '../../../common/constraint/definite-range';
import {ValueController} from '../../../common/controller/value';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {connectValues} from '../../../common/model/value-sync';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {ColorType} from '../model/color-model';
import {IntColor} from '../model/int-color';
import {ColorPickerView} from '../view/color-picker';
import {APaletteController} from './a-palette';
import {ColorTextsController} from './color-texts';
import {HPaletteController} from './h-palette';
import {SvPaletteController} from './sv-palette';

interface Config {
	colorType: ColorType;
	supportsAlpha: boolean;
	value: Value<IntColor>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorPickerController
	implements ValueController<IntColor, ColorPickerView>
{
	public readonly value: Value<IntColor>;
	public readonly view: ColorPickerView;
	public readonly viewProps: ViewProps;
	private readonly alphaIcs_: {
		palette: APaletteController;
		text: NumberTextController;
	} | null;
	private readonly hPaletteC_: HPaletteController;
	private readonly svPaletteC_: SvPaletteController;
	private readonly textsC_: ColorTextsController;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.hPaletteC_ = new HPaletteController(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		this.svPaletteC_ = new SvPaletteController(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		this.alphaIcs_ = config.supportsAlpha
			? {
					palette: new APaletteController(doc, {
						value: this.value,
						viewProps: this.viewProps,
					}),
					text: new NumberTextController(doc, {
						parser: parseNumber,
						props: ValueMap.fromObject({
							pointerScale: 0.01,
							keyScale: 0.1,
							formatter: createNumberFormatter(2),
						}),
						value: createValue(0, {
							constraint: new DefiniteRangeConstraint({min: 0, max: 1}),
						}),
						viewProps: this.viewProps,
					}),
			  }
			: null;
		if (this.alphaIcs_) {
			connectValues({
				primary: this.value,
				secondary: this.alphaIcs_.text.value,
				forward: (p) => {
					return p.rawValue.getComponents()[3];
				},
				backward: (p, s) => {
					const comps = p.rawValue.getComponents();
					comps[3] = s.rawValue;
					return new IntColor(comps, p.rawValue.mode);
				},
			});
		}
		this.textsC_ = new ColorTextsController(doc, {
			colorType: config.colorType,
			parser: parseNumber,
			value: this.value,
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
			textsView: this.textsC_.view,
			viewProps: this.viewProps,
		});
	}

	get textsController(): ColorTextsController {
		return this.textsC_;
	}
}
