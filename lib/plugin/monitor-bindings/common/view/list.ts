import {ListItem} from '../../../common/constraint/list';
import {createSvgIconElement} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';

interface Config<T> {
	options: ListItem<T>[];
	stringifyValue: (value: T) => string;
	value: Value<T>;
}

const className = ClassName('lst');

/**
 * @hidden
 */
export class ListView<T> implements ValueView<T> {
	public readonly selectElement: HTMLSelectElement;
	public readonly element: HTMLElement;
	public readonly value: Value<T>;
	private stringifyValue_: (value: T) => string;

	constructor(doc: Document, config: Config<T>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		this.stringifyValue_ = config.stringifyValue;

		const selectElem = doc.createElement('select');
		selectElem.classList.add(className('s'));
		config.options.forEach((item, index) => {
			const optionElem = doc.createElement('option');
			optionElem.dataset.index = String(index);
			optionElem.textContent = item.text;
			optionElem.value = this.stringifyValue_(item.value);
			selectElem.appendChild(optionElem);
		});
		this.element.appendChild(selectElem);
		this.selectElement = selectElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(className('m'));
		markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
		this.element.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		this.selectElement.value = this.stringifyValue_(this.value.rawValue);
	}

	private onValueChange_(): void {
		this.update();
	}
}
