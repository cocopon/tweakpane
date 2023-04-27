import {Formatter} from '../converter/formatter.js';
import {Value} from '../model/value.js';
import {ValueMap} from '../model/value-map.js';
import {ViewProps} from '../model/view-props.js';
import {ClassName} from './class-name.js';
import {InputView, View} from './view.js';

/**
 * @hidden
 */
export type TextProps<T> = ValueMap<{
	formatter: Formatter<T>;
}>;

/**
 * @hidden
 */
interface Config<T> {
	props: TextProps<T>;
	value: Value<T>;
	viewProps: ViewProps;
}

const cn = ClassName('txt');

/**
 * @hidden
 */
export class TextView<T> implements View, InputView {
	public readonly inputElement: HTMLInputElement;
	public readonly element: HTMLElement;
	private readonly props_: TextProps<T>;
	private readonly value_: Value<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onChange_ = this.onChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		this.props_ = config.props;
		this.props_.emitter.on('change', this.onChange_);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(cn('i'));
		inputElem.type = 'text';
		config.viewProps.bindDisabled(inputElem);
		this.element.appendChild(inputElem);
		this.inputElement = inputElem;

		config.value.emitter.on('change', this.onChange_);
		this.value_ = config.value;

		this.refresh();
	}

	public refresh(): void {
		const formatter = this.props_.get('formatter');
		this.inputElement.value = formatter(this.value_.rawValue);
	}

	private onChange_(): void {
		this.refresh();
	}
}
