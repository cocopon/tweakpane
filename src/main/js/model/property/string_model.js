import PropertyModel from './property_model';

class StringModel extends PropertyModel {
	constructor() {
		super();

		this.value_ = '';
	}

	static validate(value) {
		return typeof(value) === 'string';
	}
}

export default StringModel;
