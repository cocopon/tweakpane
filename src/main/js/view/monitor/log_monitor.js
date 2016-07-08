import ClassName from '../../misc/class_name';
import Monitor   from './monitor';

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

		const textareaElem = this.textareaElem_;
		const bottommost = (textareaElem.scrollTop === (textareaElem.scrollHeight - textareaElem.clientHeight));

		textareaElem.textContent = lines.join('\n');

		if (bottommost) {
			textareaElem.scrollTop = textareaElem.scrollHeight;
		}
	}

	onModelRecordChange_() {
		this.applyModel_();
	}
}

LogMonitor.BLOCK_CLASS = 'lgm';

export default LogMonitor;
