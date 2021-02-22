import {BladeController, setUpBladeView} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {Button} from '../../common/model/button';
import {ButtonView} from './view';

interface Config {
	blade: Blade;
	title: string;
}

/**
 * @hidden
 */
export class ButtonController implements BladeController {
	public readonly button: Button;
	public readonly view: ButtonView;
	public readonly blade: Blade;

	constructor(doc: Document, config: Config) {
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		this.button = new Button(config.title);

		this.blade = config.blade;
		this.view = new ButtonView(doc, {
			button: this.button,
		});
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);
		setUpBladeView(this.view, this.blade);
	}

	private onButtonClick_() {
		this.button.click();
	}
}
