import {NumberFormatter} from '../../formatter/number';
import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {Disposable} from '../../model/disposable';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {StringNumberParser} from '../../parser/string-number';
import {ColorPickerInputView} from '../../view/input/color-picker';
import {ControllerConfig} from '../controller';
import {HPaletteInputController} from './h-palette';
import {InputController} from './input';
import {RgbTextInputController} from './rgb-text';
import {SvPaletteInputController} from './sv-palette';

interface Config extends ControllerConfig {
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export class ColorPickerInputController implements InputController<Color> {
	public readonly disposable: Disposable;
	public readonly foldable: Foldable;
	public readonly value: InputValue<Color>;
	public readonly view: ColorPickerInputView;
	private hPaletteIc_: HPaletteInputController;
	private rgbTextIc_: RgbTextInputController;
	private svPaletteIc_: SvPaletteInputController;

	constructor(document: Document, config: Config) {
		this.onInputBlur_ = this.onInputBlur_.bind(this);

		this.value = config.value;
		this.foldable = new Foldable();

		this.disposable = config.disposable;
		this.hPaletteIc_ = new HPaletteInputController(document, {
			disposable: this.disposable,
			value: this.value,
		});

		this.svPaletteIc_ = new SvPaletteInputController(document, {
			disposable: this.disposable,
			value: this.value,
		});

		this.rgbTextIc_ = new RgbTextInputController(document, {
			disposable: this.disposable,
			formatter: new NumberFormatter(0),
			parser: StringNumberParser,
			value: this.value,
		});

		this.view = new ColorPickerInputView(document, {
			disposable: this.disposable,
			foldable: this.foldable,
			hPaletteInputView: this.hPaletteIc_.view,
			rgbTextView: this.rgbTextIc_.view,
			svPaletteInputView: this.svPaletteIc_.view,
			value: this.value,
		});
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onInputBlur_);
		});
	}

	private onInputBlur_(e: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.foldable.expanded = false;
		}
	}
}
