import {bindValueMap} from '../../../common/model/reactive.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {bindValueToTextContent} from '../../../common/view/reactive.js';
import {View} from '../../../common/view/view.js';

/**
 * @hidden
 */
export type TabItemPropsObject = {
	selected: boolean;
	title: string | undefined;
};

/**
 * @hidden
 */
export type TabItemProps = ValueMap<TabItemPropsObject>;

/**
 * @hidden
 */
interface Config {
	props: TabItemProps;
	viewProps: ViewProps;
}

const cn = ClassName('tbi');

/**
 * @hidden
 */
export class TabItemView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;
	public readonly titleElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);
		bindValueMap(config.props, 'selected', (selected) => {
			if (selected) {
				this.element.classList.add(cn(undefined, 'sel'));
			} else {
				this.element.classList.remove(cn(undefined, 'sel'));
			}
		});

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(cn('b'));
		config.viewProps.bindDisabled(buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const titleElem = doc.createElement('div');
		titleElem.classList.add(cn('t'));
		bindValueToTextContent(config.props.value('title'), titleElem);
		this.buttonElement.appendChild(titleElem);
		this.titleElement = titleElem;
	}
}
