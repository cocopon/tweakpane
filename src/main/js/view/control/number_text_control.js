import StepNumberConstraint from '../../constraint/step_number_constraint';
import NumberFormatter      from '../../formatter/number_formatter';
import TextControl          from './text_control';
import Control              from './control';

class NumberTextControl extends TextControl {
	constructor(property) {
		super(property);

		this.formatter_ = new NumberFormatter();

		this.inputElem_.addEventListener(
			'keydown',
			this.onInputKeyDown_.bind(this)
		);
	}

	getStep_() {
		const model = this.getProperty().getModel();
		const stepConstraint = model.findConstraintByClass(StepNumberConstraint);
		return (stepConstraint !== null) ?
			stepConstraint.getStepValue() :
			1;
	}

	onInputKeyDown_(e) {
		const step = this.getStep_() * (e.shiftKey ? 10 : 1);
		const model = this.getProperty().getModel();
		switch (e.keyCode) {
			case 38:  // UP
				this.getEmitter().notifyObservers(
					Control.EVENT_CHANGE,
					[model.getValue() + step]
				);
				break;
			case 40:  // DOWN
				this.getEmitter().notifyObservers(
					Control.EVENT_CHANGE,
					[model.getValue() - step]
				);
				break;
		}
	}
}

module.exports = NumberTextControl;
