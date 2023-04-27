import {DefiniteRangeConstraint} from '../../../common/constraint/definite-range.js';
import {ValueController} from '../../../common/controller/value.js';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number.js';
import {Value} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {connectValues} from '../../../common/model/value-sync.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {NumberTextController} from '../../../common/number/controller/number-text.js';
import {ColorType} from '../model/color-model.js';
import {IntColor} from '../model/int-color.js';
import {ColorPickerView} from '../view/color-picker.js';
import {APaletteController} from './a-palette.js';
import {ColorTextsController} from './color-texts.js';
import {HPaletteController} from './h-palette.js';
import {SvPaletteController} from './sv-palette.js';

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
				forward: (p) => p.getComponents()[3],
				backward: (p, s) => {
					const comps = p.getComponents();
					comps[3] = s;
					return new IntColor(comps, p.mode);
				},
			});
		}
		this.textsC_ = new ColorTextsController(doc, {
			colorType: config.colorType,
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
