import {createSvgIconElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier, bindDisabled} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

interface Config {
	viewProps: ViewProps;
}

const className = ClassName('p2dpadtxt');

/**
 * @hidden
 */
export class Point2dPadTextView implements View {
	public readonly element: HTMLElement;
	public readonly padButtonElement: HTMLButtonElement;
	public readonly textElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
		bindDisabled(config.viewProps, buttonElem);
		this.element.appendChild(buttonElem);
		this.padButtonElement = buttonElem;

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		this.element.appendChild(textElem);
		this.textElement = textElem;
	}
}
