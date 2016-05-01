const ClassName = require('../../misc/class_name');
const Monitor   = require('./monitor');

class MultilineTextMonitor extends Monitor {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(MultilineTextMonitor.BLOCK_CLASS)
		);

		const textareaElem = document.createElement('textarea');
		textareaElem.classList.add(
			ClassName.get(MultilineTextMonitor.BLOCK_CLASS, 'textarea')
		);
		textareaElem.readOnly = true;
		elem.appendChild(textareaElem);
		this.textareaElem_ = textareaElem;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		const model = this.getProperty().getModel();
		this.textareaElem_.textContent = model.getValue();
	}
}

MultilineTextMonitor.BLOCK_CLASS = 'mtm';

module.exports = MultilineTextMonitor;
