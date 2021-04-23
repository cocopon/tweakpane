import {PopupController} from '../../../common/controller/popup';
import {ValueController} from '../../../common/controller/value';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
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
	private pickerC_: ColorPickerController;
	private popC_: PopupController;

	constructor(doc: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);
		this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
		this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new ColorSwatchView(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);

		this.popC_ = new PopupController(doc, {
			viewProps: this.viewProps,
		});
		this.view.element.appendChild(this.popC_.view.element);

		const pickerC = new ColorPickerController(doc, {
			pickedColor: new PickedColor(this.value),
			supportsAlpha: config.supportsAlpha,
			viewProps: this.viewProps,
		});
		pickerC.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onPopupChildBlur_);
			elem.addEventListener('keydown', this.onPopupChildKeydown_);
		});
		this.popC_.view.element.appendChild(pickerC.view.element);
		this.pickerC_ = pickerC;
	}

	private onButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.popC_.shows.rawValue = false;
		}
	}

	private onButtonClick_() {
		this.popC_.shows.rawValue = !this.popC_.shows.rawValue;
		if (this.popC_.shows.rawValue) {
			this.pickerC_.view.allFocusableElements[0].focus();
		}
	}

	private onPopupChildBlur_(ev: FocusEvent): void {
		const elem = this.popC_.view.element;
		const nextTarget = findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the picker
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.view.buttonElement &&
			!supportsTouch(elem.ownerDocument)
		) {
			// Next target is the trigger button
			return;
		}

		this.popC_.shows.rawValue = false;
	}

	private onPopupChildKeydown_(ev: KeyboardEvent): void {
		if (ev.key === 'Escape') {
			this.popC_.shows.rawValue = false;
		}
	}
}
