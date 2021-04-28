import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindValueMapToTextContent} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

export type ButtonProps = ValueMap<{
	title: string;
}>;

interface Config {
	props: ButtonProps;
	viewProps: ViewProps;
}

const className = ClassName('btn');

/**
 * @hidden
 */
export class ButtonView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		config.viewProps.bindDisabled(buttonElem);
		bindValueMapToTextContent(config.props, 'title', buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;
	}
}
