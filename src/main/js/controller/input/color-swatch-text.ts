import {Formatter} from '../../formatter/formatter';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {Parser} from '../../parser/parser';
import {ColorSwatchTextInputView} from '../../view/input/color-swatch-text';
import {ColorSwatchInputController} from '../input/color-swatch';
import {InputController} from './input';
import {TextInputController} from './text';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<string, Color>;
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export class ColorSwatchTextInputController implements InputController<Color> {
	public readonly value: InputValue<Color>;
	public readonly view: ColorSwatchTextInputView;
	private swatchIc_: ColorSwatchInputController;
	private textIc_: TextInputController<Color>;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.swatchIc_ = new ColorSwatchInputController(document, {
			value: this.value,
		});

		this.textIc_ = new TextInputController(document, {
			formatter: config.formatter,
			parser: config.parser,
			value: this.value,
		});

		this.view = new ColorSwatchTextInputView(document, {
			swatchInputView: this.swatchIc_.view,
			textInputView: this.textIc_.view,
		});
	}

	public dispose(): void {
		this.view.disposable.dispose();
	}
}
