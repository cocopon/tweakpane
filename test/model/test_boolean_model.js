const BooleanModel = require('../../src/main/js/model/boolean_model');

describe('BooleanModel', () => {
	it('should have valid initial value', () => {
		const model = new BooleanModel();

		assert.strictEqual(model.getValue(), false);
		assert.isTrue(BooleanModel.validate(model.getValue()));
	});

	it('should validate value correctly', () => {
		assert.isTrue(BooleanModel.validate(true));
		assert.isTrue(BooleanModel.validate(false));

		assert.isFalse(BooleanModel.validate(null));
		assert.isFalse(BooleanModel.validate(0));
	});
});
