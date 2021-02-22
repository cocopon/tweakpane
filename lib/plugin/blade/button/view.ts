import {Button} from '../../common/model/button';
import {ClassName} from '../../common/view/class-name';
import {View} from '../../common/view/view';

interface Config {
	button: Button;
}

const className = ClassName('btn');

/**
 * @hidden
 */
export class ButtonView implements View {
	public readonly element: HTMLElement;
	public readonly button: Button;
	public readonly buttonElement: HTMLButtonElement;

	constructor(doc: Document, config: Config) {
		this.button = config.button;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button.title;
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;
	}
}
