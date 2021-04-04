import {TextController} from '../../../common/controller/text';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {Color} from '../model/color';
import {ColorSwatchTextView} from '../view/color-swatch-text';
import {ColorSwatchController} from './color-swatch';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<Color>;
	supportsAlpha: boolean;
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorSwatchTextController implements ValueController<Color> {
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchTextView;
	public readonly viewProps: ViewProps;
	private swatchIc_: ColorSwatchController;
	private textIc_: TextController<Color>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.swatchIc_ = new ColorSwatchController(doc, {
			supportsAlpha: config.supportsAlpha,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.textIc_ = new TextController(doc, {
			parser: config.parser,
			props: new ValueMap({
				formatter: config.formatter,
			}),
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new ColorSwatchTextView(doc, {
			swatchView: this.swatchIc_.view,
			textView: this.textIc_.view,
		});
	}
}
