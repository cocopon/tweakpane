const View = require('./view');

class PropertyView extends View {
	constructor() {
		super();

		this.control_ = null;
	}

	createElement_() {
		super.createElement_();

		this.addClass('propView');

		const elem = this.getElement();

		const labelElem = document.createElement('div');
		labelElem.className += 'propView_label';
		elem.appendChild(labelElem);
		this.labelElem_ = labelElem;

		const containerElem = document.createElement('div');
		containerElem.className += 'propView_container';
		elem.appendChild(containerElem);
		this.containerElem_ = containerElem;
	}

	getContainerElement_() {
		return this.containerElem_;
	}

	getControl() {
		return this.control_;
	}

	setControl(control) {
		if (this.control_ !== null) {
			this.removeSubview(this.control_);
		}

		this.addSubview(control);
		this.control_ = control;
	}

	getLabel() {
		return this.label_;
	}

	setLabel(label) {
		this.label_ = label;
		this.applyLabel_();
	}

	applyLabel_() {
		this.labelElem_.textContent = this.label_;
	}
}

module.exports = PropertyView;
