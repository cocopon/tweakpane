// @flow

import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import TextInputView from '../../view/input/text';

import type {Formatter} from '../../formatter/formatter';
import type {Parser} from '../../parser/parser';
import type {InputController} from './input';

export type Config<T> = {
	formatter: Formatter<T>,
	parser: Parser<T>,
	value: InputValue<T>,
};

export default class TextInputController<T> implements InputController<T> {
	+value: InputValue<T>;
	+view: TextInputView<T>;
	parser_: Parser<T>;

	constructor(document: Document, config: Config<T>) {
		(this: any).onInputChange_ = this.onInputChange_.bind(this);

		this.parser_ = config.parser;
		this.value = config.value;

		this.view = new TextInputView(document, {
			formatter: config.formatter,
			value: this.value,
		});
		this.view.inputElement.addEventListener(
			'change',
			this.onInputChange_,
		);
	}

	onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = FlowUtil.forceCast(e.currentTarget);
		const value = inputElem.value;

		FlowUtil.ifNotEmpty(this.parser_(value), (parsedValue) => {
			this.value.rawValue = parsedValue;
		});
		this.view.update();
	}
}
