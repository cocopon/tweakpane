// @flow

import ConstraintUtil from '../../constraint/util';
import StepConstraint from '../../constraint/step';
import FlowUtil from '../../misc/flow-util';
import InputValue from '../../model/input-value';
import TextInputController from './text';

import type {Config} from './text';

function findStep(value: InputValue<number>): ?number {
	const c = value.constraint
		? ConstraintUtil.findConstraint(value.constraint, StepConstraint)
		: null;
	if (!c) {
		return null;
	}

	return c.step;
}

function estimateSuitableStep(value: InputValue<number>): number {
	const step = findStep(value);
	return FlowUtil.getOrDefault(step, 1);
}

export default class NumberTextInputController extends TextInputController<number> {
	step_: number;

	constructor(document: Document, config: Config<number>) {
		super(document, config);

		(this: any).onInputKeyDown_ = this.onInputKeyDown_.bind(this);

		this.step_ = estimateSuitableStep(this.value);

		this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
	}

	onInputKeyDown_(e: KeyboardEvent): void {
		const step = this.step_ * (e.altKey ? 0.1 : 1) * (e.shiftKey ? 10 : 1);

		if (e.keyCode === 38) {
			this.value.rawValue += step;
			this.view.update();
		} else if (e.keyCode === 40) {
			this.value.rawValue -= step;
			this.view.update();
		}
	}
}
