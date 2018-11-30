// @flow

import Button from '../model/button';
import ButtonView from '../view/button';

type Config = {
	title: string,
};

export default class ButtonController {
	+button: Button;
	+view: ButtonView;

	constructor(document: Document, config: Config) {
		(this: any).onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.view = new ButtonView(document, {
			button: this.button,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	onButtonClick_() {
		this.button.click();
	}
}
