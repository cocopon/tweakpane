const Property = require('../model/property');

class PropertyBuilder {
	constructor(target, propName, model) {
		this.target_ = target;
		this.propName_ = propName;
		this.model_ = model;

		this.id_ = propName;
		this.label_ = propName;
	}

	getTarget() {
		return this.target_;
	}

	getPropertyName() {
		return this.propName_;
	}

	getModel() {
		return this.model_;
	}

	getId() {
		return this.id_;
	}

	setId(id) {
		this.id_ = id;
	}

	getLabel() {
		return this.label_;
	}

	setLabel(label) {
		this.label_ = label;
	}

	build() {
		return new Property(this);
	}
}

module.exports = PropertyBuilder;
