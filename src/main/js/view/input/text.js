// @flow

import ClassName from '../../misc/class-name';
import InputValue from '../../model/input-value';
import View from '../view';

import type {Formatter} from '../../formatter/formatter';
import type {InputView} from './input';

type Config<T> = {
	formatter: Formatter<T>,
	value: InputValue<T>,
};

const className = ClassName('txt', 'input');

export default class TextInputView<T> extends View implements InputView<T> {
	+value: InputValue<T>;
	formatter_: Formatter<T>;
	inputElem_: HTMLInputElement;

	constructor(document: Document, config: Config<T>) {
		super(document);

		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get inputElement(): HTMLInputElement {
		return this.inputElem_;
	}

	update(): void {
		this.inputElem_.value = this.formatter_.format(this.value.rawValue);
	}

	onValueChange_(): void {
		this.update();
	}
}
