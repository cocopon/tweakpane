import PropertyModel from './property_model';

class BooleanModel extends PropertyModel {
	constructor() {
		super();

		this.value_ = false;
	}

	static validate(value) {
		return typeof(value) === 'boolean';
	}
}

export default BooleanModel;
