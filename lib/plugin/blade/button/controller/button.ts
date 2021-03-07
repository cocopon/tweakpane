import {Controller} from '../../../common/controller/controller';
import {Button} from '../model/button';
import {ButtonView} from '../view';

interface Config {
	title: string;
}

/**
 * @hidden
 */
export class ButtonController implements Controller {
	public readonly button: Button;
	public readonly view: ButtonView;

	constructor(doc: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.view = new ButtonView(doc, {
			button: this.button,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	private onButtonClick_() {
		this.button.click();
	}
}
