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

const cn = ClassName('tab');

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

		const contentsElem = config.contentsElement;
		contentsElem.classList.add(cn('c'));
		this.element.appendChild(contentsElem);
		this.contentsElement = contentsElem;
	}
}
