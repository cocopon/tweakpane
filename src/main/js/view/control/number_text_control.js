const StepNumberConstraint = require('../../constraint/step_number_constraint');
const TextControl          = require('./text_control');
const Control              = require('./control');

class NumberTextControl extends TextControl {
	constructor(model) {
		super(model);

		this.inputElem_.addEventListener(
			'keydown',
			this.onInputKeyDown_.bind(this)
		);
	}

	getStep_() {
		const stepConstraint = this.getModel().findConstraintByClass(StepNumberConstraint);
		return (stepConstraint !== null) ?
			stepConstraint.getStepValue() :
			0.1;
	}

	onInputKeyDown_(e) {
		const step = this.getStep_() * (e.shiftKey ? 10 : 1);
		const model = this.getModel();
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
