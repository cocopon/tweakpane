import {TypeUtil} from '../../misc/type-util';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {CheckboxInputView} from '../../view/input/checkbox';
import {ControllerConfig} from '../controller';
import {InputController} from './input';

/**
 * @hidden
 */
export interface Config extends ControllerConfig {
	value: InputValue<boolean>;
}

/**
 * @hidden
 */
export class CheckboxInputController implements InputController<boolean> {
	public readonly disposable: Disposable;
	public readonly value: InputValue<boolean>;
	public readonly view: CheckboxInputView;

	constructor(document: Document, config: Config) {
		this.onInputChange_ = this.onInputChange_.bind(this);

		this.value = config.value;

		this.disposable = config.disposable;
		this.view = new CheckboxInputView(document, {
			disposable: this.disposable,
			value: this.value,
		});
		this.view.inputElement.addEventListener('change', this.onInputChange_);
	}

	private onInputChange_(e: Event): void {
		const inputElem: HTMLInputElement = TypeUtil.forceCast(e.currentTarget);
		this.value.rawValue = inputElem.checked;
		this.view.update();
	}
}
