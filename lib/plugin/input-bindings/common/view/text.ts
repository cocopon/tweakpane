import {Formatter} from '../../../common/converter/formatter';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier, bindDisabled} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

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
		bindClassModifier(config.viewProps, this.element);

		this.props_ = config.props;
		this.props_.emitter.on('change', this.onChange_);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'text';
		bindDisabled(config.viewProps, inputElem);
		this.element.appendChild(inputElem);
		this.inputElement = inputElem;

		config.value.emitter.on('change', this.onChange_);
		this.value_ = config.value;

		this.update_();
	}

	private update_(): void {
		const formatter = this.props_.get('formatter');
		this.inputElement.value = formatter(this.value_.rawValue);
	}

	private onChange_(): void {
		this.update_();
	}
}
