import {forceCast, isEmpty} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {Parser} from '../../../common/reader/parser';
import {Formatter} from '../../../common/writer/formatter';
import {TextView} from '../view/text';

/**
 * @hidden
 */
export interface Config<T> {
	formatter: Formatter<T>;
	parser: Parser<string, T>;
	value: Value<T>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class TextController<T> implements ValueController<T> {
	public readonly viewModel: ViewModel;
	public readonly value: Value<T>;
	public readonly view: TextView<T>;
	private parser_: Parser<string, T>;

	constructor(document: Document, config: Config<T>) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new TextView(document, {
			formatter: config.formatter,
			model: this.viewModel,
			value: this.value,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = forceCast(e.currentTarget);
		const value = inputElem.value;

		const parsedValue = this.parser_(value);
		if (!isEmpty(parsedValue)) {
			this.value.rawValue = parsedValue;
		}
		this.view.update();
	}
}
