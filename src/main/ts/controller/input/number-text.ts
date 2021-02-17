import * as UiUtil from '../ui-util';
import {TextController} from './text';
import {Config as BaseConfig} from './text';

interface Config extends BaseConfig<number> {
	baseStep: number;
}

/**
 * @hidden
 */
export class NumberTextController extends TextController<number> {
	private baseStep_: number;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.baseStep_ = config.baseStep;

		this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
	}

	private onInputKeyDown_(e: KeyboardEvent): void {
		const step = UiUtil.getStepForKey(
			this.baseStep_,
			UiUtil.getVerticalStepKeys(e),
		);
		if (step !== 0) {
			this.value.rawValue += step;
			this.view.update();
		}
	}
}
