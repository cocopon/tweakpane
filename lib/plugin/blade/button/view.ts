import {ClassName} from '../../common/view/class-name';
import {bindDisabled, bindViewProps} from '../../common/view/reactive';
import {View, ViewProps} from '../../common/view/view';
import {Button} from './model/button';

interface Config {
	button: Button;
	viewProps: ViewProps;
}

const className = ClassName('btn');

/**
 * @hidden
 */
export class ButtonView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;
	private readonly button_: Button;
	private readonly viewProps_: ViewProps;

	constructor(doc: Document, config: Config) {
		this.button_ = config.button;
		this.viewProps_ = config.viewProps;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindViewProps(this.viewProps_, this.element);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button_.title;
		bindDisabled(this.viewProps_, buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;
	}
}
