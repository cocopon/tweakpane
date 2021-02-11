import {Button} from '../model/button';
import {ViewModel} from '../model/view-model';
import {ButtonView} from '../view/button';

interface Config {
	viewModel: ViewModel;
	title: string;
}

/**
 * @hidden
 */
export class ButtonController {
	public readonly button: Button;
	public readonly view: ButtonView;
	public readonly viewModel: ViewModel;

	constructor(document: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.viewModel = config.viewModel;
		this.view = new ButtonView(document, {
			button: this.button,
			model: this.viewModel,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
	}

	private onButtonClick_() {
		this.button.click();
	}
}
