import {ClassName} from '../misc/class-name';
import * as DisposingUtil from '../misc/disposing-util';
import {PaneError} from '../misc/pane-error';
import {Button} from '../model/button';
import {View} from './view';

interface Config {
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
		super(document);

		this.button = config.button;

		this.element.classList.add(className());

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.textContent = this.button.title;
		this.element.appendChild(buttonElem);
		this.buttonElem_ = buttonElem;
	}

	get buttonElement(): HTMLButtonElement {
		if (!this.buttonElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.buttonElem_;
	}

	public dispose(): void {
		this.buttonElem_ = DisposingUtil.disposeElement(this.buttonElem_);
		super.dispose();
	}
}
