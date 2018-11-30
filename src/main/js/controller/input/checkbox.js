// @flow

import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import CheckboxInputView from '../../view/input/checkbox';

import type {InputController} from './input';

export type Config = {
	value: InputValue<boolean>,
};

export default class CheckboxInputController
	implements InputController<boolean> {
	+value: InputValue<boolean>;
	+view: CheckboxInputView;

	constructor(document: Document, config: Config) {
		(this: any).onInputChange_ = this.onInputChange_.bind(this);

		this.value = config.value;

		this.view = new CheckboxInputView(document, {
			value: this.value,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
	}

	onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = FlowUtil.forceCast(e.currentTarget);
		this.value.rawValue = inputElem.checked;
		this.view.update();
	}
}
