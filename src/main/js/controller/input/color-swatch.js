// @flow

import FlowUtil from '../../misc/flow-util';
import Color from '../../model/color';
import InputValue from '../../model/input-value';
import ColorSwatchInputView from '../../view/input/color-swatch';
import ColorPickerInputController from './color-picker';

import type {InputController} from './input';

type Config = {
	value: InputValue<Color>,
};

export default class ColorSwatchInputController
	implements InputController<Color> {
	+value: InputValue<Color>;
	+view: ColorSwatchInputView;
	pickerIc_: ColorPickerInputController;

	constructor(document: Document, config: Config) {
		(this: any).onButtonBlur_ = this.onButtonBlur_.bind(this);
		(this: any).onButtonClick_ = this.onButtonClick_.bind(this);

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

	onButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: ?HTMLElement = FlowUtil.forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.pickerIc_.foldable.expanded = false;
		}
	}

	onButtonClick_() {
		this.pickerIc_.foldable.expanded = !this.pickerIc_.foldable.expanded;
	}
}
