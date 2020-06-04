import {ListItem} from '../../constraint/list';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {InputValue} from '../../model/input-value';
import {View, ViewConfig} from '../view';
import {InputView} from './input';

interface Config<T> extends ViewConfig {
	options: ListItem<T>[];
	stringifyValue: (value: T) => string;
	value: InputValue<T>;
}

const className = ClassName('lst', 'input');

/**
 * @hidden
 */
export class ListInputView<T> extends View implements InputView<T> {
	public readonly value: InputValue<T>;
	private selectElem_: HTMLSelectElement | null;
	private stringifyValue_: (value: T) => string;

	constructor(document: Document, config: Config<T>) {
		super(document, config);

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

		config.model.emitter.on('dispose', () => {
			this.selectElem_ = DisposingUtil.disposeElement(this.selectElem_);
		});
	}

	get selectElement(): HTMLSelectElement {
		if (!this.selectElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.selectElem_;
	}

	public update(): void {
		if (!this.selectElem_) {
			throw PaneError.alreadyDisposed();
		}
		this.selectElem_.value = this.stringifyValue_(this.value.rawValue);
	}

	private onValueChange_(): void {
		this.update();
	}
}
