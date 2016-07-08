class Reference {
	constructor(target, propertyName) {
		this.target_ = target;
		this.propName_ = propertyName;
	}

	getTarget() {
		return this.target_;
	}

	getPropertyName() {
		return this.propName_;
	}

	getValue() {
		return this.target_[this.propName_];
	}

	setValue(value) {
		this.target_[this.propName_] = value;
	}
}

export default Reference;
