// @flow

import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import CheckboxInputView from '../../view/input/checkbox';

import {InputController} from './input';

export interface Config {
	value: InputValue<boolean>;
}

export default class CheckboxInputController
	implements InputController<boolean> {
	public readonly value: InputValue<boolean>;
	public readonly view: CheckboxInputView;

	constructor(document: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.value = config.value;

		this.view = new CheckboxInputView(document, {
			value: this.value,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = FlowUtil.forceCast(e.currentTarget);
		this.value.rawValue = inputElem.checked;
		this.view.update();
	}
}
