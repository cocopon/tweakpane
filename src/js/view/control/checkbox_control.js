const Control = require('./control');

class CheckboxControl extends Control {
	createElement_() {
		super.createElement_();

		this.addClass('checkboxControl');

		const inputElem = document.createElement('input');
		inputElem.className += 'checkboxControl_input';
		inputElem.type = 'checkbox';
		this.getElement().appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;
	}

	applyModel_() {
		super.applyModel_();

		this.inputElem_.checked = this.getModel().getValue();
	}

	onInputElementChange_() {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.inputElem_.checked]
		);
	}
}

module.exports = CheckboxControl;

