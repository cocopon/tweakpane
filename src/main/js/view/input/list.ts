import ClassName from '../../misc/class-name';
import InputValue from '../../model/input-value';
import View from '../view';

import {ListItem} from '../../constraint/list';
import {InputView} from './input';

interface Config<T> {
	options: ListItem<T>[];
	stringifyValue: (value: T) => string;
	value: InputValue<T>;
}

const className = ClassName('lst', 'input');

export default class ListInputView<T> extends View implements InputView<T> {
	public readonly value: InputValue<T>;
	private selectElem_: HTMLSelectElement;
	private stringifyValue_: (value: T) => string;

	constructor(document: Document, config: Config<T>) {
		super(document);

		this.onValueChange_ = this.onValueChange_.bind(this);

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
		this.value = config.value;

		this.update();
	}

	get selectElement(): HTMLSelectElement {
		return this.selectElem_;
	}

	public update(): void {
		this.selectElem_.value = this.stringifyValue_(this.value.rawValue);
	}

	private onValueChange_(): void {
		this.update();
	}
}
