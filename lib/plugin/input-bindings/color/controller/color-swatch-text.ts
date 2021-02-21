import {ValueController} from '../../../common/controller/value';
import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
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
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorSwatchTextController implements ValueController<Color> {
	public readonly viewModel: ViewModel;
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchTextView;
	private swatchIc_: ColorSwatchController;
	private textIc_: TextController<Color>;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.swatchIc_ = new ColorSwatchController(document, {
			supportsAlpha: config.supportsAlpha,
			value: this.value,
			viewModel: this.viewModel,
		});

		this.textIc_ = new TextController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: this.value,
			viewModel: this.viewModel,
		});

		this.view = new ColorSwatchTextView(document, {
			swatchView: this.swatchIc_.view,
			textView: this.textIc_.view,
			model: this.viewModel,
		});
	}
}
