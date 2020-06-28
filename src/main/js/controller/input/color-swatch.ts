import {TypeUtil} from '../../misc/type-util';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {ViewModel} from '../../model/view-model';
import {ColorSwatchInputView} from '../../view/input/color-swatch';
import {ColorPickerInputController} from './color-picker';
import {InputController} from './input';

interface Config {
	supportsAlpha: boolean;
	value: InputValue<Color>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ColorSwatchInputController implements InputController<Color> {
	public readonly viewModel: ViewModel;
	public readonly value: InputValue<Color>;
	public readonly view: ColorSwatchInputView;
	private pickerIc_: ColorPickerInputController;

	constructor(document: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.value = config.value;

		this.viewModel = config.viewModel;
		this.pickerIc_ = new ColorPickerInputController(document, {
			pickedColor: new PickedColor(this.value),
			supportsAlpha: config.supportsAlpha,
			viewModel: this.viewModel,
		});

		this.view = new ColorSwatchInputView(document, {
			model: this.viewModel,
			pickerInputView: this.pickerIc_.view,
			value: this.value,
		});
		this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
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
		if (this.pickerIc_.foldable.expanded) {
			this.pickerIc_.view.allFocusableElements[0].focus();
		}
	}
}
