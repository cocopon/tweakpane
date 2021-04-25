import {PopupController} from '../../../common/controller/popup';
import {TextController} from '../../../common/controller/text';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {forceCast} from '../../../misc/type-util';
import {Color} from '../model/color';
import {PickedColor} from '../model/picked-color';
import {ColorSwatchTextView} from '../view/color-swatch-text';
import {ColorPickerController} from './color-picker';
import {ColorSwatchController} from './color-swatch';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<Color>;
	supportsAlpha: boolean;
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorSwatchTextController implements ValueController<Color> {
	public readonly value: Value<Color>;
	public readonly view: ColorSwatchTextView;
	public readonly viewProps: ViewProps;
	private swatchC_: ColorSwatchController;
	private textIc_: TextController<Color>;
	private pickerC_: ColorPickerController;
	private popC_: PopupController;

	constructor(doc: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);
		this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
		this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.swatchC_ = new ColorSwatchController(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		const buttonElem = this.swatchC_.view.buttonElement;
		buttonElem.addEventListener('blur', this.onButtonBlur_);
		buttonElem.addEventListener('click', this.onButtonClick_);

		this.textIc_ = new TextController(doc, {
			parser: config.parser,
			props: new ValueMap({
				formatter: config.formatter,
			}),
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new ColorSwatchTextView(doc, {
			swatchView: this.swatchC_.view,
			textView: this.textIc_.view,
		});

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
			nextTarget === this.swatchC_.view.buttonElement &&
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
