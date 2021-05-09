import {bindValueMap} from '../../../common/model/reactive';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindValueToTextContent} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

export type TabItemPropsObject = {
	selected: boolean;
	title: string | undefined;
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
		config.viewProps.bindClassModifiers(this.element);
		bindValueMap(config.props, 'selected', (selected) => {
			if (selected) {
				this.element.classList.add(className(undefined, 'sel'));
			} else {
				this.element.classList.remove(className(undefined, 'sel'));
			}
		});

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		config.viewProps.bindDisabled(buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const titleElem = doc.createElement('div');
		titleElem.classList.add(className('t'));
		bindValueToTextContent(config.props.value('title'), titleElem);
		this.buttonElement.appendChild(titleElem);
		this.titleElement = titleElem;
	}
}
