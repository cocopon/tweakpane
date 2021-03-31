import {Controller} from '../../../common/controller/controller';
import {ViewProps} from '../../../common/model/view-props';
import {Button} from '../model/button';
import {ButtonView} from '../view/button';

interface Config {
	title: string;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class ButtonController implements Controller {
	public readonly button: Button;
	public readonly view: ButtonView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);
		this.viewProps = config.viewProps;

		this.view = new ButtonView(doc, {
			button: this.button,
			viewProps: this.viewProps,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	private onButtonClick_() {
		this.button.click();
	}
}
