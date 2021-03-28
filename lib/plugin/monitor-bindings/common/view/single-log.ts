import {Formatter} from '../../../common/converter/formatter';
import {BufferedValue} from '../../../common/model/buffered-value';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier, bindDisabled} from '../../../common/view/reactive';
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
	public readonly value: BufferedValue<T>;
	private formatter_: Formatter<T>;
	private inputElem_: HTMLInputElement;

	constructor(doc: Document, config: Config<T>) {
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.readOnly = true;
		inputElem.type = 'text';
		bindDisabled(config.viewProps, inputElem);
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update_();
	}

	private update_(): void {
		const values = this.value.rawValue;
		const lastValue = values[values.length - 1];
		this.inputElem_.value =
			lastValue !== undefined ? this.formatter_(lastValue) : '';
	}

	private onValueUpdate_(): void {
		this.update_();
	}
}
