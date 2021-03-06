import {createSvgIconElement} from '../../common/dom-util';
import {Value} from '../../common/model/value';
import {ClassName} from '../../common/view/class-name';
import {ValueView} from '../../common/view/value';

interface Config {
	value: Value<boolean>;
}

const className = ClassName('ckb');

/**
 * @hidden
 */
export class CheckboxView implements ValueView<boolean> {
	public readonly element: HTMLElement;
	public readonly inputElement: HTMLInputElement;
	public readonly value: Value<boolean>;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const labelElem = doc.createElement('label');
		labelElem.classList.add(className('l'));
		this.element.appendChild(labelElem);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		this.inputElement = inputElem;

		const wrapperElem = doc.createElement('div');
		wrapperElem.classList.add(className('w'));
		labelElem.appendChild(wrapperElem);

		const markElem = createSvgIconElement(doc, 'check');
		wrapperElem.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		this.inputElement.checked = this.value.rawValue;
	}

	private onValueChange_(): void {
		this.update();
	}
}
