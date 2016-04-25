const Display   = require('../../display/display');
const ClassName = require('../../misc/class_name');
const Monitor   = require('./monitor');

class TextMonitor extends Monitor {
	constructor(model) {
		super(model);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(TextMonitor.BLOCK_CLASS)
		);

		const inputElem = document.createElement('input');
		inputElem.classList.add(
			ClassName.get(TextMonitor.BLOCK_CLASS, 'input')
		);
		inputElem.readOnly = true;
		inputElem.type = 'text';
		elem.appendChild(inputElem);
		this.inputElem_ = inputElem;

		this.display_ = new Display();

		this.applyModel_();
	}

	getDisplay() {
		return this.display_;
	}

	setDisplay(display) {
		this.display_ = display;
		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		if (this.display_) {
			this.inputElem_.value = this.display_.display(
				this.getModel().getValue()
			);
		}
	}
}

TextMonitor.BLOCK_CLASS = 'tm';

module.exports = TextMonitor;
