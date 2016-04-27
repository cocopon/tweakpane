const ClassName = require('../../misc/class_name');
const Monitor   = require('./monitor');

class LogMonitor extends Monitor {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(LogMonitor.BLOCK_CLASS)
		);

		const textareaElem = document.createElement('textarea');
		textareaElem.classList.add(
			ClassName.get(LogMonitor.BLOCK_CLASS, 'textarea')
		);
		textareaElem.readOnly = true;
		elem.appendChild(textareaElem);
		this.textareaElem_ = textareaElem;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		const model = this.getProperty().getModel();
		const lines = model.getRecords().slice();
		lines.push(model.getValue());
		lines.reverse();
		this.textareaElem_.textContent = lines.join('\n');
	}
}

LogMonitor.BLOCK_CLASS = 'lm';

module.exports = LogMonitor;
