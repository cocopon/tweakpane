import {disposeElement} from '../../common/disposing-util';
import {Button} from '../../common/model/button';
import {PaneError} from '../../common/pane-error';
import {ClassName} from '../../common/view/class-name';
import {View, ViewConfig} from '../../common/view/view';

interface Config extends ViewConfig {
	button: Button;
}

const className = ClassName('btn');

/**
 * @hidden
 */
export class ButtonView extends View {
	public readonly button: Button;
	private buttonElem_: HTMLButtonElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.button = config.button;

		this.element.classList.add(className());

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button.title;
		this.element.appendChild(buttonElem);
		this.buttonElem_ = buttonElem;

		config.model.emitter.on('dispose', () => {
			this.buttonElem_ = disposeElement(this.buttonElem_);
		});
	}

	get buttonElement(): HTMLButtonElement {
		if (!this.buttonElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.buttonElem_;
	}
}
