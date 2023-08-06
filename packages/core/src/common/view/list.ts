import {ListItem} from '../constraint/list.js';
import {createSvgIconElement, removeChildElements} from '../dom-util.js';
import {bindValueMap} from '../model/reactive.js';
import {Value} from '../model/value.js';
import {ValueMap} from '../model/value-map.js';
import {ViewProps} from '../model/view-props.js';
import {ClassName} from './class-name.js';
import {View} from './view.js';

/**
 * @hidden
 */
export type ListProps<T> = ValueMap<{
	options: ListItem<T>[];
}>;

/**
 * @hidden
 */
interface Config<T> {
	props: ListProps<T>;
	value: Value<T>;
	viewProps: ViewProps;
}

const cn = ClassName('lst');

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
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const selectElem = doc.createElement('select');
		selectElem.classList.add(cn('s'));
		config.viewProps.bindDisabled(selectElem);
		this.element.appendChild(selectElem);
		this.selectElement = selectElem;

		const markElem = doc.createElement('div');
		markElem.classList.add(cn('m'));
		markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
		this.element.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value_ = config.value;

		bindValueMap(this.props_, 'options', (opts) => {
			removeChildElements(this.selectElement);

			opts.forEach((item) => {
				const optionElem = doc.createElement('option');
				optionElem.textContent = item.text;
				this.selectElement.appendChild(optionElem);
			});
			this.update_();
		});
	}

	private update_(): void {
		const values = this.props_.get('options').map((o) => o.value);
		this.selectElement.selectedIndex = values.indexOf(this.value_.rawValue);
	}

	private onValueChange_(): void {
		this.update_();
	}
}
