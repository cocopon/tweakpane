import {Formatter} from '../converter/formatter';
import {Value} from '../model/value';
import {ValueMap} from '../model/value-map';
import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';
import {View} from './view';

export type TextProps<T> = ValueMap<{
	formatter: Formatter<T>;
}>;

interface Config<T> {
	props: TextProps<T>;
	value: Value<T>;
	viewProps: ViewProps;
}

const className = ClassName('txt');

/**
 * @hidden
 */
export class TextView<T> implements View {
	public readonly inputElement: HTMLInputElement;
	public readonly element: HTMLElement;
	private readonly props_: TextProps<T>;
	private readonly value_: Value<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onChange_ = this.onChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		this.props_ = config.props;
		this.props_.emitter.on('change', this.onChange_);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
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
