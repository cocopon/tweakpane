import {Formatter} from '../../formatter/formatter';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {Parser} from '../../parser/parser';
import {ColorSwatchTextInputView} from '../../view/input/color-swatch-text';
import {ColorSwatchInputController} from './color-swatch';
import {InputController} from './input';
import {TextInputController} from './text';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<string, Color>;
	supportsAlpha: boolean;
	value: InputValue<Color>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorSwatchTextInputController implements InputController<Color> {
	public readonly viewModel: ViewModel;
	public readonly value: InputValue<Color>;
	public readonly view: ColorSwatchTextInputView;
	private swatchIc_: ColorSwatchInputController;
	private textIc_: TextInputController<Color>;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.swatchIc_ = new ColorSwatchInputController(document, {
			supportsAlpha: config.supportsAlpha,
			value: this.value,
			viewModel: this.viewModel,
		});

		this.textIc_ = new TextInputController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: this.value,
			viewModel: this.viewModel,
		});

		this.view = new ColorSwatchTextInputView(document, {
			swatchInputView: this.swatchIc_.view,
			textInputView: this.textIc_.view,
			model: this.viewModel,
		});
	}
}
