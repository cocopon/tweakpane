import {Button} from '../model/button';
import {Disposable} from '../model/disposable';
import {ButtonView} from '../view/button';

interface Config {
	disposable: Disposable;
	title: string;
}

/**
 * @hidden
 */
export class ButtonController {
	public readonly disposable: Disposable;
	public readonly button: Button;
	public readonly view: ButtonView;

	constructor(document: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.disposable = config.disposable;
		this.view = new ButtonView(document, {
			button: this.button,
			disposable: this.disposable,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	private onButtonClick_() {
		this.button.click();
	}
}
