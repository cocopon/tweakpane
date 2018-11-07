// @flow

import ClassName from '../../misc/class-name';
import InputValue from '../../model/input-value';
import View from '../view';

import type {ListItem} from '../../constraint/list';
import type {InputView} from './input';

type Config<T> = {
	options: ListItem<T>[],
	stringifyValue: (T) => string,
	value: InputValue<T>,
};

const className = ClassName('lst', 'input');

export default class ListInputView<T> extends View implements InputView<T> {
	selectElem_: HTMLSelectElement;
	stringifyValue_: (T) => string;
	value_: InputValue<T>;

	constructor(document: Document, config: Config<T>) {
		super(document);

		(this: any).onValueChange_ = this.onValueChange_.bind(this);

		this.element.classList.add(className());

		this.stringifyValue_ = config.stringifyValue;

		const selectElem = document.createElement('select');
		selectElem.classList.add(className('s'));
		config.options.forEach((item, index) => {
			const optionElem = document.createElement('option');
			optionElem.dataset.index = String(index);
			optionElem.textContent = item.text;
			optionElem.value = this.stringifyValue_(item.value);
			selectElem.appendChild(optionElem);
		});
		this.element.appendChild(selectElem);
		this.selectElem_ = selectElem;

		const markElem = document.createElement('div');
		markElem.classList.add(className('m'));
		this.element.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value_ = config.value;

		this.update();
	}

	get selectElement(): HTMLSelectElement {
		return this.selectElem_;
	}

	get value(): InputValue<T> {
		return this.value_;
	}

	update(): void {
		this.selectElem_.value = this.stringifyValue_(this.value_.rawValue);
	}

	onValueChange_(): void {
		this.update();
	}
}
