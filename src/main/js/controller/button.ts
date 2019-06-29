import Button from '../model/button';
import ButtonView from '../view/button';

interface Config {
	title: string;
}

/**
 * @hidden
 */
export default class ButtonController {
	public readonly button: Button;
	public readonly view: ButtonView;

	constructor(document: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.view = new ButtonView(document, {
			button: this.button,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	public dispose(): void {
		this.view.dispose();
	}

	private onButtonClick_() {
		this.button.click();
	}
}
