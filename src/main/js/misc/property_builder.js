import Property from '../model/property/property';

class PropertyBuilder {
	constructor(ref, model) {
		this.ref_ = ref;
		this.model_ = model;

		this.forMonitor_ = false;
		const propName = this.ref_.getPropertyName();
		this.id_ = propName;
		this.label_ = propName;
	}

	getReference() {
		return this.ref_;
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

	isForMonitor() {
		return this.forMonitor_;
	}

	setForMonitor(forMonitor) {
		this.forMonitor_ = forMonitor;
	}

	build() {
		return new Property(this);
	}
}

export default PropertyBuilder;
