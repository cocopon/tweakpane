import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {forceCast} from '../../../misc/type-util';
import {Color} from '../model/color';
import {PickedColor} from '../model/picked-color';
import {ColorSwatchView} from '../view/color-swatch';
import {ColorPickerController} from './color-picker';

interface Config {
	supportsAlpha: boolean;
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorSwatchController implements ValueController<Color> {
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchView;
	public readonly viewProps: ViewProps;
	private pickerIc_: ColorPickerController;

	constructor(doc: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.pickerIc_ = new ColorPickerController(doc, {
			pickedColor: new PickedColor(this.value),
			supportsAlpha: config.supportsAlpha,
			viewProps: this.viewProps,
		});

		this.view = new ColorSwatchView(doc, {
			pickerView: this.pickerIc_.view,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
		this.pickerIc_.triggerElement = this.view.buttonElement;
	}

	private onButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.pickerIc_.expanded.rawValue = false;
		}
	}

	private onButtonClick_() {
		this.pickerIc_.expanded.rawValue = !this.pickerIc_.expanded.rawValue;
		if (this.pickerIc_.expanded.rawValue) {
			this.pickerIc_.view.allFocusableElements[0].focus();
		}
	}
}
