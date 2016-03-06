const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class CheckboxControl extends Control {
	createElement_() {
		super.createElement_();

		this.addClass(ClassName.get(CheckboxControl.BLOCK_CLASS));

		const elem = this.getElement();

		const labelElem = document.createElement('label');
		labelElem.className += ClassName.get(CheckboxControl.BLOCK_CLASS, 'hitArea');
		elem.appendChild(labelElem);

		const inputElem = document.createElement('input');
		inputElem.className += ClassName.get(CheckboxControl.BLOCK_CLASS, 'input');
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;

		const outerElem = document.createElement('div');
		outerElem.className += ClassName.get(CheckboxControl.BLOCK_CLASS, 'outer');
		labelElem.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.className += ClassName.get(CheckboxControl.BLOCK_CLASS, 'inner');
		outerElem.appendChild(innerElem);
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

CheckboxControl.BLOCK_CLASS = 'CheckboxControl';

module.exports = CheckboxControl;

