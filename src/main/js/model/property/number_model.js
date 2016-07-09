import PropertyModel from './property_model';

class NumberModel extends PropertyModel {
	constructor() {
		super();

		this.value_ = 0.0;
	}

	static validate(value) {
		return typeof(value) === 'number';
	}
}

export default NumberModel;
