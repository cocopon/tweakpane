import {ListItem} from '../../../common/constraint/list';
import {
	createSvgIconElement,
	removeChildElements,
} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {
	bindClassModifier,
	bindDisabled,
	bindValueMap,
} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

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
	private props_: ListProps<T>;

	constructor(doc: Document, config: Config<T>) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.props_ = config.props;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

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
		bindDisabled(config.viewProps, selectElem);
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
