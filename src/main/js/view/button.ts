import {ClassName} from '../misc/class-name';
import * as DisposingUtil from '../misc/disposing-util';
import {PaneError} from '../misc/pane-error';
import {Button} from '../model/button';
import {View, ViewConfig} from './view';

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

		config.disposable.emitter.on('dispose', () => {
			this.buttonElem_ = DisposingUtil.disposeElement(this.buttonElem_);
		});
	}

	get buttonElement(): HTMLButtonElement {
		if (!this.buttonElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.buttonElem_;
	}
}
