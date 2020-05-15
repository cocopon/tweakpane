import {Formatter} from '../../formatter/formatter';
import {Color} from '../../model/color';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {Parser} from '../../parser/parser';
import {ColorSwatchTextInputView} from '../../view/input/color-swatch-text';
import {ControllerConfig} from '../controller';
import {ColorSwatchInputController} from '../input/color-swatch';
import {InputController} from './input';
import {TextInputController} from './text';

interface Config extends ControllerConfig {
	formatter: Formatter<Color>;
	parser: Parser<string, Color>;
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export class ColorSwatchTextInputController implements InputController<Color> {
	public readonly disposable: Disposable;
	public readonly value: InputValue<Color>;
	public readonly view: ColorSwatchTextInputView;
	private swatchIc_: ColorSwatchInputController;
	private textIc_: TextInputController<Color>;

	constructor(document: Document, config: Config) {
		this.value = config.value;

		this.disposable = config.disposable;
		this.swatchIc_ = new ColorSwatchInputController(document, {
			disposable: this.disposable,
			value: this.value,
		});

		this.disposable = config.disposable;
		this.textIc_ = new TextInputController(document, {
			disposable: this.disposable,
			formatter: config.formatter,
			parser: config.parser,
			value: this.value,
		});

		this.disposable = config.disposable;
		this.view = new ColorSwatchTextInputView(document, {
			disposable: this.disposable,
			swatchInputView: this.swatchIc_.view,
			textInputView: this.textIc_.view,
		});
	}
}
