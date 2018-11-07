// @flow

import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import CheckboxInputView from '../../view/input/checkbox';

import type {InputController} from './input';

export type Config = {
	value: InputValue<boolean>,
};

export default class CheckboxInputController implements InputController<boolean> {
	value_: InputValue<boolean>;
	view_: CheckboxInputView;

	constructor(document: Document, config: Config) {
		(this: any).onInputChange_ = this.onInputChange_.bind(this);

		this.value_ = config.value;

		this.view_ = new CheckboxInputView(document, {
			value: this.value_,
		});
		this.view_.inputElement.addEventListener(
			'change',
			this.onInputChange_,
		);
	}

	get value(): InputValue<boolean> {
		return this.value_;
	}

	get view(): CheckboxInputView {
		return this.view_;
	}

	onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = FlowUtil.forceCast(e.currentTarget);
		this.value_.rawValue = inputElem.checked;
		this.view_.update();
	}
}
