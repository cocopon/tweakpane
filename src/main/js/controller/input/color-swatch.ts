import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {ColorSwatchInputView} from '../../view/input/color-swatch';
import {ColorPickerInputController} from './color-picker';
import {InputController} from './input';

interface Config {
	value: InputValue<Color>;
}

/**
 * @hidden
 */
export class ColorSwatchInputController implements InputController<Color> {
	public readonly value: InputValue<Color>;
	public readonly view: ColorSwatchInputView;
	private pickerIc_: ColorPickerInputController;

	constructor(document: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.value = config.value;

		this.pickerIc_ = new ColorPickerInputController(document, {
			value: this.value,
		});

		this.view = new ColorSwatchInputView(document, {
			pickerInputView: this.pickerIc_.view,
			value: this.value,
		});
		this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	public dispose(): void {
		this.view.dispose();
	}

	private onButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = TypeUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.pickerIc_.foldable.expanded = false;
		}
	}

	private onButtonClick_() {
		this.pickerIc_.foldable.expanded = !this.pickerIc_.foldable.expanded;
	}
}
