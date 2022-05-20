import {Formatter} from '../../../common/converter/formatter';
import {BufferedValue} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';

interface Config<T> {
	formatter: Formatter<T>;
	value: BufferedValue<T>;
	viewProps: ViewProps;
}

const className = ClassName('sgl');

/**
 * @hidden
 */
export class SingleLogView<T> implements View {
	public readonly element: HTMLElement;
	public readonly inputElement: HTMLInputElement;
	public readonly value: BufferedValue<T>;
	private readonly formatter_: Formatter<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.readOnly = true;
		inputElem.type = 'text';
		config.viewProps.bindDisabled(inputElem);
		this.element.appendChild(inputElem);
		this.inputElement = inputElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update_();
	}

	private update_(): void {
		const values = this.value.rawValue;
		const lastValue = values[values.length - 1];
		this.inputElement.value =
			lastValue !== undefined ? this.formatter_(lastValue) : '';
	}

	private onValueUpdate_(): void {
		this.update_();
	}
}
