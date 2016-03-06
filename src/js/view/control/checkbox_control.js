const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class CheckboxControl extends Control {
	createElement_() {
		super.createElement_();

		this.addClass(ClassName.get('CheckboxControl'));

		const inputElem = document.createElement('input');
		inputElem.className += ClassName.get('CheckboxControl', 'input');
		inputElem.type = 'checkbox';
		this.getElement().appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;
	}

	applyDisabled_() {
		super.applyDisabled_();

		this.inputElem_.readOnly = this.isDisabled();
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

