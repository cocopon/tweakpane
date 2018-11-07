// @flow

import ClassName from '../misc/class-name';
import Button from '../model/button';
import View from './view';

type Config = {
	button: Button,
};

const className = ClassName('btn');

export default class ButtonView extends View {
	button_: Button;
	buttonElem_: HTMLButtonElement;

	constructor(document: Document, config: Config) {
		super(document);

		this.button_ = config.button;

		this.element.classList.add(className());

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button_.title;
		this.element.appendChild(buttonElem);
		this.buttonElem_ = buttonElem;
	}

	get buttonElement(): HTMLButtonElement {
		return this.buttonElem_;
	}
}
