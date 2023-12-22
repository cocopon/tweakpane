import {createSvgIconElement} from '../../../common/dom-util.js';
import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';

interface Config {
	value: Value<boolean>;
	viewProps: ViewProps;
}

const cn = ClassName('ckb');

/**
 * @hidden
 */
export class CheckboxView implements View {
	public readonly element: HTMLElement;
	public readonly inputElement: HTMLInputElement;
	public readonly labelElement: HTMLLabelElement;
	public readonly value: Value<boolean>;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const labelElem = doc.createElement('label');
		labelElem.classList.add(cn('l'));
		this.element.appendChild(labelElem);
		this.labelElement = labelElem;

		const inputElem = doc.createElement('input');
		inputElem.classList.add(cn('i'));
		inputElem.type = 'checkbox';
		this.labelElement.appendChild(inputElem);
		this.inputElement = inputElem;
		config.viewProps.bindDisabled(this.inputElement);

		const wrapperElem = doc.createElement('div');
		wrapperElem.classList.add(cn('w'));
		this.labelElement.appendChild(wrapperElem);

		const markElem = createSvgIconElement(doc, 'check');
		wrapperElem.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update_();
	}

	private update_(): void {
		this.inputElement.checked = this.value.rawValue;
	}

	private onValueChange_(): void {
		this.update_();
	}
}
