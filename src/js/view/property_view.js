const ClassName = require('../misc/class_name');
const Property  = require('../model/property');
const View      = require('./view');

class PropertyView extends View {
	constructor(property) {
		super();

		this.control_ = null;

		this.prop_ = property;
		this.prop_.getEmitter().on(
			Property.EVENT_CHANGE,
			this.onPropertyChange_,
			this
		);
		this.applyProperty_();
	}

	createElement_() {
		super.createElement_();

		this.addClass(ClassName.get('PropView'));

		const elem = this.getElement();

		const labelElem = document.createElement('div');
		labelElem.className += ClassName.get('PropView', 'label');
		elem.appendChild(labelElem);
		this.labelElem_ = labelElem;

		const containerElem = document.createElement('div');
		containerElem.className += ClassName.get('PropView', 'container');
		elem.appendChild(containerElem);
		this.containerElem_ = containerElem;
	}

	getProperty() {
		return this.prop_;
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
		this.applyProperty_();
	}

	applyProperty_() {
		this.labelElem_.textContent = this.prop_.getDisplayName();
		if (this.control_ !== null) {
			this.control_.setDisabled(this.prop_.isDisabled());
		}
	}

	onPropertyChange_() {
		this.applyProperty_();
	}
}

module.exports = PropertyView;
