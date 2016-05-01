const StringModel = require('../../src/main/js/model/string_model');

describe('StringModel', () => {
	it('should have valid initial value', () => {
		const model = new StringModel();

		assert.strictEqual(model.getValue(), '');
		assert.isTrue(StringModel.validate(model.getValue()));
	});

	it('should validate value correctly', () => {
		assert.isTrue(StringModel.validate(''));
		assert.isTrue(StringModel.validate('hello, world'));

		assert.isFalse(StringModel.validate(null));
		assert.isFalse(StringModel.validate(0));
	});
});
