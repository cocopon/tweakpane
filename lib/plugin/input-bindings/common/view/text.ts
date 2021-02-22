import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {Formatter} from '../../../common/writer/formatter';

interface Config<T> {
	formatter: Formatter<T>;
	value: Value<T>;
}

const className = ClassName('txt');

/**
 * @hidden
 */
export class TextView<T> implements ValueView<T> {
	public readonly inputElement: HTMLInputElement;
	public readonly value: Value<T>;
	public readonly element: HTMLElement;
	private formatter_: Formatter<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatter_ = config.formatter;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElement = inputElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		this.inputElement.value = this.formatter_.format(this.value.rawValue);
	}

	private onValueChange_(): void {
		this.update();
	}
}
