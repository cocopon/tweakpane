import {ValueController} from '../../../common/controller/value';
import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {Parser} from '../../../common/reader/parser';
import {Formatter} from '../../../common/writer/formatter';
import {TextController} from '../../common/controller/text';
import {ColorSwatchTextView} from '../view/color-swatch-text';
import {ColorSwatchController} from './color-swatch';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<string, Color>;
	supportsAlpha: boolean;
	value: Value<Color>;
}

/**
 * @hidden
 */
export class ColorSwatchTextController implements ValueController<Color> {
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchTextView;
	private swatchIc_: ColorSwatchController;
	private textIc_: TextController<Color>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;

		this.swatchIc_ = new ColorSwatchController(doc, {
			supportsAlpha: config.supportsAlpha,
			value: this.value,
		});

		this.textIc_ = new TextController(doc, {
			formatter: config.formatter,
			parser: config.parser,
			value: this.value,
		});

		this.view = new ColorSwatchTextView(doc, {
			swatchView: this.swatchIc_.view,
			textView: this.textIc_.view,
		});
	}
}
