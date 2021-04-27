import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {
	bindClassModifier,
	bindDisabled,
	bindTextContent,
	bindValueMap,
} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

export type TabItemPropsObject = {
	selected: boolean;
	title: string;
};

export type TabItemProps = ValueMap<TabItemPropsObject>;

interface Config {
	props: TabItemProps;
	viewProps: ViewProps;
}

const className = ClassName('tbi');

/**
 * @hidden
 */
export class TabItemView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;
	public readonly titleElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);
		bindValueMap(config.props, 'selected', (selected) => {
			if (selected) {
				this.element.classList.add(className(undefined, 'sel'));
			} else {
				this.element.classList.remove(className(undefined, 'sel'));
			}
		});

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		bindDisabled(config.viewProps, buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const titleElem = doc.createElement('div');
		titleElem.classList.add(className('t'));
		bindTextContent(config.props, 'title', titleElem);
		this.buttonElement.appendChild(titleElem);
		this.titleElement = titleElem;
	}
}
