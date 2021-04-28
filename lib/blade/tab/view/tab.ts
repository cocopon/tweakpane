import {bindValue} from '../../../common/model/reactive';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {valueToClassName} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';
import {bladeContainerClassName} from '../../common/view/blade-container';

interface Config {
	contentsElement: HTMLElement;
	empty: Value<boolean>;
	viewProps: ViewProps;
}

const className = ClassName('tab');

/**
 * @hidden
 */
export class TabView implements View {
	public readonly element: HTMLElement;
	public readonly itemsElement: HTMLElement;
	public readonly contentsElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className(), bladeContainerClassName());
		config.viewProps.bindClassModifiers(this.element);
		bindValue(
			config.empty,
			valueToClassName(this.element, className(undefined, 'nop')),
		);

		const itemsElem = doc.createElement('div');
		itemsElem.classList.add(className('i'));
		this.element.appendChild(itemsElem);
		this.itemsElement = itemsElem;

		const contentsElem = config.contentsElement;
		contentsElem.classList.add(className('c'));
		this.element.appendChild(contentsElem);
		this.contentsElement = contentsElem;
	}
}
