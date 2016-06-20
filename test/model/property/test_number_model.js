const NumberModel = require('../../../src/main/js/model/property/number_model');

describe('NumberModel', () => {
	it('should have valid initial value', () => {
		const model = new NumberModel();

		assert.strictEqual(model.getValue(), 0);
		assert.isTrue(NumberModel.validate(model.getValue()));
	});

	it('should validate value correctly', () => {
		assert.isTrue(NumberModel.validate(0));
		assert.isTrue(NumberModel.validate(Number.MIN_VALUE));
		assert.isTrue(NumberModel.validate(Number.MAX_VALUE));

		assert.isFalse(NumberModel.validate(null));
		assert.isFalse(NumberModel.validate('0'));
	});
});
