import {PickerLayout} from '../../../blade/common/api/types';
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
import {ColorView} from '../view/color-swatch-text';
import {ColorPickerController} from './color-picker';
import {ColorSwatchController} from './color-swatch';

interface Config {
	formatter: Formatter<Color>;
	parser: Parser<Color>;
	pickerLayout: PickerLayout;
	supportsAlpha: boolean;
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ColorController implements ValueController<Color> {
	public readonly value: Value<Color>;
	public readonly view: ColorView;
	public readonly viewProps: ViewProps;
	private swatchC_: ColorSwatchController;
	private textC_: TextController<Color>;
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
		if (config.pickerLayout === 'popup') {
			const buttonElem = this.swatchC_.view.buttonElement;
			buttonElem.addEventListener('blur', this.onButtonBlur_);
			buttonElem.addEventListener('click', this.onButtonClick_);
		}

		this.textC_ = new TextController(doc, {
			parser: config.parser,
			props: new ValueMap({
				formatter: config.formatter,
			}),
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new ColorView(doc, {
			pickerLayout: config.pickerLayout,
		});
		this.view.swatchElement.appendChild(this.swatchC_.view.element);
		this.view.textElement.appendChild(this.textC_.view.element);

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
		if (config.pickerLayout === 'popup') {
			this.popC_.view.element.appendChild(pickerC.view.element);
		} else {
			this.view.pickerElement?.appendChild(pickerC.view.element);
		}
		this.pickerC_ = pickerC;
	}

	get textController(): TextController<Color> {
		return this.textC_;
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
