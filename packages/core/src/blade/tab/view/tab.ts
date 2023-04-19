import {bindValue} from '../../../common/model/reactive.js';
import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {valueToClassName} from '../../../common/view/reactive.js';
import {View} from '../../../common/view/view.js';
import {bladeContainerClassName} from '../../common/view/blade-container.js';

/**
 * @hidden
 */
interface Config {
	empty: Value<boolean>;
	viewProps: ViewProps;
}

const cn = ClassName('tab');

/**
 * @hidden
 */
export class TabView implements View {
	public readonly element: HTMLElement;
	public readonly itemsElement: HTMLElement;
	public readonly contentsElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn(), bladeContainerClassName());
		config.viewProps.bindClassModifiers(this.element);
		bindValue(
			config.empty,
			valueToClassName(this.element, cn(undefined, 'nop')),
		);

		const titleElem = doc.createElement('div');
		titleElem.classList.add(cn('t'));
		this.element.appendChild(titleElem);
		this.itemsElement = titleElem;

		const indentElem = doc.createElement('div');
		indentElem.classList.add(cn('i'));
		this.element.appendChild(indentElem);

		const contentsElem = doc.createElement('div');
		contentsElem.classList.add(cn('c'));
		this.element.appendChild(contentsElem);
		this.contentsElement = contentsElem;
	}
}
