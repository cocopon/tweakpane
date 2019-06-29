import ClassName from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import PaneError from '../../misc/pane-error';
import InputValue from '../../model/input-value';
import View from '../view';

import {InputView} from './input';

interface Config {
	value: InputValue<boolean>;
}

const className = ClassName('ckb', 'input');

/**
 * @hidden
 */
export default class CheckboxInputView extends View
	implements InputView<boolean> {
	public readonly value: InputValue<boolean>;
	private inputElem_: HTMLInputElement | null;

	constructor(document: Document, config: Config) {
		super(document);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element.classList.add(className());

		const labelElem = document.createElement('label');
		labelElem.classList.add(className('l'));
		this.element.appendChild(labelElem);

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		this.inputElem_ = inputElem;

		const markElem = document.createElement('div');
		markElem.classList.add(className('m'));
		labelElem.appendChild(markElem);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get inputElement(): HTMLInputElement {
		if (!this.inputElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.inputElem_;
	}

	public dispose(): void {
		this.inputElem_ = DisposingUtil.disposeElement(this.inputElem_);
		super.dispose();
	}

	public update(): void {
		if (!this.inputElem_) {
			throw PaneError.alreadyDisposed();
		}
		this.inputElem_.checked = this.value.rawValue;
	}

	private onValueChange_(): void {
		this.update();
	}
}
