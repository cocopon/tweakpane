import {
	getStepForKey,
	getVerticalStepKeys,
} from '../../../common/controller/ui-util';
import {TextController} from '../../common/controller/text';
import {Config as BaseConfig} from '../../common/controller/text';

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
		const step = getStepForKey(this.baseStep_, getVerticalStepKeys(e));
		if (step !== 0) {
			this.value.rawValue += step;
			this.view.update();
		}
	}
}
