// @flow

import ListConstraint from '../../constraint/list';
import ConstraintUtil from '../../constraint/util';
import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import ListInputView from '../../view/input/list';

import type {ListItem} from '../../constraint/list';
import type {InputController} from './input';

type Config<T> = {
	stringifyValue: (T) => string,
	value: InputValue<T>,
};

function findListItems<T>(value: InputValue<T>): ?ListItem<T>[] {
	const c = value.constraint ?
		ConstraintUtil.findConstraint(
			value.constraint,
			ListConstraint,
		) :
		null;
	if (!c) {
		return null;
	}

	return c.options;
}

export default class ListInputController<T> implements InputController<T> {
	listItems_: ListItem<T>[];
	value_: InputValue<T>;
	view_: ListInputView<T>;

	constructor(document: Document, config: Config<T>) {
		(this: any).onSelectChange_ = this.onSelectChange_.bind(this);

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

	onSelectChange_(e: Event): void {
		const selectElem: HTMLSelectElement = FlowUtil.forceCast(e.currentTarget);
		const optElem = selectElem.selectedOptions.item(0);
		if (!optElem) {
			return;
		}

		const itemIndex = Number(optElem.dataset.index);
		this.value_.rawValue = this.listItems_[itemIndex].value;

		this.view_.update();
	}
}
