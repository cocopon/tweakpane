import {BladeController, setUpBladeView} from '../../common/controller/blade';
import {Button} from '../../common/model/button';
import {ViewModel} from '../../common/model/view-model';
import {ButtonView} from './view';

interface Config {
	viewModel: ViewModel;
	title: string;
}

/**
 * @hidden
 */
export class ButtonController implements BladeController {
	public readonly button: Button;
	public readonly view: ButtonView;
	public readonly viewModel: ViewModel;

	constructor(doc: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.viewModel = config.viewModel;
		this.view = new ButtonView(doc, {
			button: this.button,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
		setUpBladeView(this.view, this.viewModel);
	}

	private onButtonClick_() {
		this.button.click();
	}
}
