import {ListItem} from '../constraint/list';
import {createSvgIconElement, removeChildElements} from '../dom-util';
import {bindValueMap} from '../model/reactive';
import {Value} from '../model/value';
import {ValueMap} from '../model/value-map';
import {ViewProps} from '../model/view-props';
import {ClassName} from './class-name';
import {View} from './view';

export type ListProps<T> = ValueMap<{
	options: ListItem<T>[];
}>;

interface Config<T> {
	props: ListProps<T>;
	value: Value<T>;
	viewProps: ViewProps;
}

const className = ClassName('lst');

/**
 * @hidden
 */
export class ListView<T> implements View {
	public readonly selectElement: HTMLSelectElement;
	public readonly element: HTMLElement;
	private readonly value_: Value<T>;
	private readonly props_: ListProps<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.props_ = config.props;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const selectElem = doc.createElement('select');
		selectElem.classList.add(className('s'));
		bindValueMap(this.props_, 'options', (opts) => {
			removeChildElements(selectElem);

			opts.forEach((item, index) => {
				const optionElem = doc.createElement('option');
				optionElem.dataset.index = String(index);
				optionElem.textContent = item.text;
				optionElem.value = String(item.value);
				selectElem.appendChild(optionElem);
			});
		});
		config.viewProps.bindDisabled(selectElem);
		this.element.appendChild(selectElem);
		this.selectElement = selectElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(className('m'));
		markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
		this.element.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value_ = config.value;

		this.update_();
	}

	private update_(): void {
		this.selectElement.value = String(this.value_.rawValue);
	}

	private onValueChange_(): void {
		this.update_();
	}
}
