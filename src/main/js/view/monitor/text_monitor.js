const Formatter = require('../../formatter/formatter');
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

		if (this.formatter_) {
			this.inputElem_.value = this.formatter_.format(
				this.getModel().getValue()
			);
		}
	}
}

TextMonitor.BLOCK_CLASS = 'tm';

module.exports = TextMonitor;
