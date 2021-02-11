import {TypeUtil} from '../../misc/type-util';
import * as UiUtil from '../ui-util';
import {TextInputController} from './text';
import {Config as BaseConfig} from './text';

interface Config extends BaseConfig<number> {
	step?: number;
}

/**
 * @hidden
 */
export class NumberTextInputController extends TextInputController<number> {
	private step_: number;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.step_ = TypeUtil.getOrDefault(
			config.step,
			UiUtil.getStepForTextInput(this.value.constraint),
		);

		this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const step = UiUtil.getStepForKey(
			this.step_,
			UiUtil.getVerticalStepKeys(e),
		);
		if (step !== 0) {
			this.value.rawValue += step;
			this.view.update();
		}
	}
}
