const ColorModel = require('../../src/main/js/model/color_model');

describe('ColorModel', () => {
	it('should have valid initial value', () => {
		const model = new ColorModel();

		const value = model.getValue();
		assert.sameMembers(value, [0, 0, 0]);
		assert.isTrue(ColorModel.validate(model.getValue()));
	});

	it('should validate value correctly', () => {
		assert.isTrue(ColorModel.validate([0, 0, 0]));
		assert.isTrue(ColorModel.validate([255, 255, 255]));

		assert.isFalse(ColorModel.validate(null));
		assert.isFalse(ColorModel.validate([]));
	});
});
