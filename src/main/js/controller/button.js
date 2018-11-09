// @flow

import Button from '../model/button';
import ButtonView from '../view/button';

type Config = {
	title: string,
};

export default class ButtonController {
	button_: Button;
	view_: ButtonView;

	constructor(document: Document, config: Config) {
		(this: any).onButtonClick_ = this.onButtonClick_.bind(this);

		this.button_ = new Button(config.title);

		this.view_ = new ButtonView(document, {
			button: this.button_,
		});
		this.view_.buttonElement.addEventListener(
			'click',
			this.onButtonClick_,
		);
	}

	get button(): Button {
		return this.button_;
	}

	get view(): ButtonView {
		return this.view_;
	}

	onButtonClick_() {
		this.button_.click();
	}
}
