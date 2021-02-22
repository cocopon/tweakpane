import {forceCast} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Color} from '../../../common/model/color';
import {PickedColor} from '../../../common/model/picked-color';
import {Value} from '../../../common/model/value';
import {ColorSwatchView} from '../view/color-swatch';
import {ColorPickerController} from './color-picker';

interface Config {
	supportsAlpha: boolean;
	value: Value<Color>;
}

/**
 * @hidden
 */
export class ColorSwatchController implements ValueController<Color> {
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchView;
	private pickerIc_: ColorPickerController;

	constructor(doc: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.value = config.value;

		this.pickerIc_ = new ColorPickerController(doc, {
			pickedColor: new PickedColor(this.value),
			supportsAlpha: config.supportsAlpha,
		});

		this.view = new ColorSwatchView(doc, {
			pickerView: this.pickerIc_.view,
			value: this.value,
		});
		this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
		this.pickerIc_.triggerElement = this.view.buttonElement;
	}

	private onButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = forceCast(e.relatedTarget);
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
