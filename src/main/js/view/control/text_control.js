const Formatter = require('../../formatter/formatter');
const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class TextControl extends Control {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(TextControl.BLOCK_CLASS)
		);

		const inputElem = document.createElement('input');
		inputElem.classList.add(
			ClassName.get(TextControl.BLOCK_CLASS, 'input')
		);
		inputElem.type = 'text';
		elem.appendChild(inputElem);
		inputElem.addEventListener(
			'blur',
			this.onInputElementBlur_.bind(this)
		);
		elem.appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;

		this.formatter_ = new Formatter();

		this.applyModel_();
	}

	getFormatter() {
		return this.formatter_;
	}

	setFormatter(formatter) {
		this.formatter_ = formatter;
		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		const model = this.getProperty().getModel();
		this.inputElem_.value = this.formatter_.format(
			model.getValue()
		);
	}

	onInputElementBlur_() {
		this.applyModel_();
	}

	onInputElementChange_() {
		console.log('change');
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.inputElem_.value]
		);
	}
}

TextControl.BLOCK_CLASS = 'txc';

module.exports = TextControl;
