import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier, bindDisabled} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';
import {Button} from '../model/button';

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

	constructor(doc: Document, config: Config) {
		this.button_ = config.button;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button_.title;
		bindDisabled(config.viewProps, buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;
	}
}
