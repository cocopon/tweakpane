const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class CheckboxControl extends Control {
	createElement_() {
		super.createElement_();

		this.addClass(ClassName.get('CheckboxControl'));

		const elem = this.getElement();

		const inputElem = document.createElement('input');
		inputElem.className += ClassName.get('CheckboxControl', 'input');
		inputElem.type = 'checkbox';
		elem.appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;

		const macheElem = document.createElement('div');
		macheElem.className += ClassName.get('CheckboxControl', 'mache');
		elem.appendChild(macheElem);
	}

	applyDisabled_() {
		super.applyDisabled_();

		this.inputElem_.disabled = this.isDisabled();
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

