const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class CheckboxControl extends Control {
	constructor(model) {
		super(model);

		this.addClass(ClassName.get(CheckboxControl.BLOCK_CLASS));

		const labelElem = document.createElement('label');
		labelElem.className = ClassName.get(CheckboxControl.BLOCK_CLASS, 'hitArea');
		this.getElement().appendChild(labelElem);

		const inputElem = document.createElement('input');
		inputElem.className = ClassName.get(CheckboxControl.BLOCK_CLASS, 'input');
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;

		const outerElem = document.createElement('div');
		outerElem.className = ClassName.get(CheckboxControl.BLOCK_CLASS, 'outer');
		labelElem.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.className = ClassName.get(CheckboxControl.BLOCK_CLASS, 'inner');
		outerElem.appendChild(innerElem);
	}

	applyDisabled_() {
		super.applyDisabled_();

		if (this.inputElem_ !== undefined) {
			this.inputElem_.disabled = this.isDisabled();
		}
	}

	applyModel_() {
		super.applyModel_();

		if (this.inputElem_ !== undefined) {
			this.inputElem_.checked = this.getModel().getValue();
		}
	}

	onInputElementChange_() {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.inputElem_.checked]
		);
	}
}

CheckboxControl.BLOCK_CLASS = 'cc';

module.exports = CheckboxControl;

