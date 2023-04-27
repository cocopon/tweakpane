import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {bindValueToTextContent} from '../../../common/view/reactive.js';
import {View} from '../../../common/view/view.js';

/**
 * @hidden
 */
export type ButtonPropsObject = {
	title: string | undefined;
};

/**
 * @hidden
 */
export type ButtonProps = ValueMap<ButtonPropsObject>;

/**
 * @hidden
 */
interface Config {
	props: ButtonProps;
	viewProps: ViewProps;
}

const cn = ClassName('btn');

/**
 * @hidden
 */
export class ButtonView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(cn('b'));
		config.viewProps.bindDisabled(buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const titleElem = doc.createElement('div');
		titleElem.classList.add(cn('t'));
		bindValueToTextContent(config.props.value('title'), titleElem);
		this.buttonElement.appendChild(titleElem);
	}
}
