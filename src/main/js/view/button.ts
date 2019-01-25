import ClassName from '../misc/class-name';
import Button from '../model/button';
import View from './view';

interface Config {
	button: Button;
}

const className = ClassName('btn');

/**
 * @hidden
 */
export default class ButtonView extends View {
	public readonly button: Button;
	private buttonElem_: HTMLButtonElement;

	constructor(document: Document, config: Config) {
		super(document);

		this.button = config.button;

		this.element.classList.add(className());

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button.title;
		this.element.appendChild(buttonElem);
		this.buttonElem_ = buttonElem;
	}

	get buttonElement(): HTMLButtonElement {
		return this.buttonElem_;
	}
}
