import {forceCast, isEmpty} from '../../misc/type-util';
import {Parser} from '../converter/parser';
import {Value} from '../model/value';
import {ViewProps} from '../model/view-props';
import {TextProps, TextView} from '../view/text';
import {ValueController} from './value';

/**
 * @hidden
 */
export interface Config<T> {
	props: TextProps<T>;
	parser: Parser<T>;
	value: Value<T>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class TextController<T> implements ValueController<T, TextView<T>> {
	public readonly props: TextProps<T>;
	public readonly value: Value<T>;
	public readonly view: TextView<T>;
	public readonly viewProps: ViewProps;
	private readonly parser_: Parser<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.parser_ = config.parser;
		this.props = config.props;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new TextView(doc, {
			props: config.props,
			value: this.value,
			viewProps: this.viewProps,
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
		this.view.refresh();
	}
}
