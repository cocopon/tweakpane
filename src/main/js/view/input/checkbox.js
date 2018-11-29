// @flow

import ClassName from '../../misc/class-name';
import InputValue from '../../model/input-value';
import View from '../view';

import type {InputView} from './input';

type Config = {
	value: InputValue<boolean>,
};

const className = ClassName('ckb', 'input');

export default class CheckboxInputView extends View implements InputView<boolean> {
	+value: InputValue<boolean>;
	inputElem_: HTMLInputElement;

	constructor(document: Document, config: Config) {
		super(document);

		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.element.classList.add(className());

		const labelElem = document.createElement('label');
		labelElem.classList.add(className('l'));
		this.element.appendChild(labelElem);

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		this.inputElem_ = inputElem;

		const markElem = document.createElement('div');
		markElem.classList.add(className('m'));
		labelElem.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get inputElement(): HTMLInputElement {
		return this.inputElem_;
	}

	update(): void {
		this.inputElem_.checked = this.value.rawValue;
	}

	onValueChange_(): void {
		this.update();
	}
}
