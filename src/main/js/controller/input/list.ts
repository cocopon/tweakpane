import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import TypeUtil from '../../misc/type-util';
import InputValue from '../../model/input-value';
import ListInputView from '../../view/input/list';

import {ListItem} from '../../constraint/list';
import {InputController} from './input';

interface Config<T> {
	stringifyValue: (value: T) => string;
	value: InputValue<T>;
}

function findListItems<T>(value: InputValue<T>): (ListItem<T>[]) | null {
	const c = value.constraint
		? ConstraintUtil.findConstraint<ListConstraint<T>>(
				value.constraint,
				ListConstraint,
		  )
		: null;
	if (!c) {
		return null;
	}

	return c.options;
}

/**
 * @hidden
 */
export default class ListInputController<T> implements InputController<T> {
	private listItems_: ListItem<T>[];
	private value_: InputValue<T>;
	private view_: ListInputView<T>;

	constructor(document: Document, config: Config<T>) {
		this.onSelectChange_ = this.onSelectChange_.bind(this);

		this.value_ = config.value;

		this.listItems_ = findListItems(this.value_) || [];
		this.view_ = new ListInputView(document, {
			options: this.listItems_,
			stringifyValue: config.stringifyValue,
			value: this.value_,
		});
		this.view_.selectElement.addEventListener('change', this.onSelectChange_);
	}

	get value(): InputValue<T> {
		return this.value_;
	}

	get view(): ListInputView<T> {
		return this.view_;
	}

	public dispose(): void {
		this.view.dispose();
	}

	private onSelectChange_(e: Event): void {
		const selectElem: HTMLSelectElement = TypeUtil.forceCast(e.currentTarget);
		const optElem = selectElem.selectedOptions.item(0);
		if (!optElem) {
			return;
		}

		const itemIndex = Number(optElem.dataset.index);
		this.value_.rawValue = this.listItems_[itemIndex].value;

		this.view_.update();
	}
}
