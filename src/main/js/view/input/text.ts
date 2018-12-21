// @flow

import ClassName from '../../misc/class-name';
import InputValue from '../../model/input-value';
import View from '../view';

import {Formatter} from '../../formatter/formatter';
import {InputView} from './input';

interface Config<T> {
	formatter: Formatter<T>;
	value: InputValue<T>;
}

const className = ClassName('txt', 'input');

export default class TextInputView<T> extends View implements InputView<T> {
	public readonly value: InputValue<T>;
	private formatter_: Formatter<T>;
	private inputElem_: HTMLInputElement;

	constructor(document: Document, config: Config<T>) {
		super(document);

		this.onValueChange_ = this.onValueChange_.bind(this);

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

	public update(): void {
		this.inputElem_.value = this.formatter_.format(this.value.rawValue);
	}

	private onValueChange_(): void {
		this.update();
	}
}
