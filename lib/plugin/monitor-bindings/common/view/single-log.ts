import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {Formatter} from '../../../common/writer/formatter';

interface Config<T> {
	formatter: Formatter<T>;
	value: BufferedValue<T>;
}

const className = ClassName('sgl');

/**
 * @hidden
 */
export class SingleLogView<T> implements ValueView<Buffer<T>> {
	public readonly element: HTMLElement;
	public readonly value: BufferedValue<T>;
	private formatter_: Formatter<T>;
	private inputElem_: HTMLInputElement;

	constructor(doc: Document, config: Config<T>) {
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.readOnly = true;
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		const values = this.value.rawValue;
		const lastValue = values[values.length - 1];
		this.inputElem_.value =
			lastValue !== undefined ? this.formatter_.format(lastValue) : '';
	}

	private onValueUpdate_(): void {
		this.update();
	}
}
