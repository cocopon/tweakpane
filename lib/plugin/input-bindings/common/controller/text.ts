import {forceCast, isEmpty} from '../../../../misc/type-util';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
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
}

/**
 * @hidden
 */
export class TextController<T> implements ValueController<T> {
	public readonly value: Value<T>;
	public readonly view: TextView<T>;
	private parser_: Parser<string, T>;

	constructor(doc: Document, config: Config<T>) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		this.view = new TextView(doc, {
			formatter: config.formatter,
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
