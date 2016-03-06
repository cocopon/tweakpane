const Display   = require('../../display/display');
const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class TextControl extends Control {
	constructor(model) {
		super(model);

		this.display_ = new Display();
	}

	createElement_() {
		super.createElement_();

		this.addClass(ClassName.get(TextControl.BLOCK_CLASS));

		const inputElem = document.createElement('input');
		inputElem.className += ClassName.get(TextControl.BLOCK_CLASS, 'input');
		inputElem.type = 'text';
		this.getElement().appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;
	}

	getDisplay() {
		return this.display_;
	}

	setDisplay(display) {
		this.display_ = display;
		this.applyModel_();
	}

	applyDisabled_() {
		super.applyDisabled_();

		this.inputElem_.readOnly = this.isDisabled();
	}

	applyModel_() {
		super.applyModel_();

		if (this.display_) {
			this.inputElem_.value = this.display_.display(
				this.getModel().getValue()
			);
		}
	}

	onInputElementChange_() {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.inputElem_.value]
		);
	}
}

TextControl.BLOCK_CLASS = 'TextControl';

module.exports = TextControl;
