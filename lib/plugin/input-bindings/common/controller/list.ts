import {forceCast} from '../../../../misc/type-util';
import {ListItem} from '../../../common/constraint/list';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {ListView} from '../../../monitor-bindings/common/view/list';

interface Config<T> {
	listItems: ListItem<T>[];
	stringifyValue: (value: T) => string;
	value: Value<T>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class ListController<T> implements ValueController<T> {
	public readonly viewModel: ViewModel;
	private listItems_: ListItem<T>[];
	private value_: Value<T>;
	private view_: ListView<T>;

	constructor(document: Document, config: Config<T>) {
		this.onSelectChange_ = this.onSelectChange_.bind(this);

		this.value_ = config.value;

		this.listItems_ = config.listItems;
		this.viewModel = config.viewModel;
		this.view_ = new ListView(document, {
			model: this.viewModel,
			options: this.listItems_,
			stringifyValue: config.stringifyValue,
			value: this.value_,
		});
		this.view_.selectElement.addEventListener('change', this.onSelectChange_);
	}

	get value(): Value<T> {
		return this.value_;
	}

	get view(): ListView<T> {
		return this.view_;
	}

	private onSelectChange_(e: Event): void {
		const selectElem: HTMLSelectElement = forceCast(e.currentTarget);
		const optElem = selectElem.selectedOptions.item(0);
		if (!optElem) {
			return;
		}

		const itemIndex = Number(optElem.dataset.index);
		this.value_.rawValue = this.listItems_[itemIndex].value;

		this.view_.update();
	}
}
