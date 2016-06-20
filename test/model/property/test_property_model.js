const MaxNumberConstraint = require('../../../src/main/js/constraint/max_number_constraint');
const MinNumberConstraint = require('../../../src/main/js/constraint/min_number_constraint');
const PropertyModel       = require('../../../src/main/js/model/property/property_model');
const Model               = require('../../../src/main/js/model/model');

describe('PropertyModel', () => {
	it('should have null value by default', () => {
		const model = new PropertyModel();

		assert.isNull(model.getValue());
	});

	it('should not have any constraints by default', () => {
		const model = new PropertyModel();

		assert.lengthOf(model.getConstraints(), 0);
	});

	it('should get/set value', () => {
		const model = new PropertyModel();

		model.setValue('hello');
		assert.strictEqual(model.getValue(), 'hello');
	});

	it('should fire change event', (done) => {
		const model = new PropertyModel();

		model.getEmitter().on(
			Model.EVENT_CHANGE,
			(value) => {
				assert.strictEqual(value, 'hello');
				done();
			}
		);
		model.setValue('hello');
	});

	it('should find constraint by class', () => {
		const model = new PropertyModel();

		const maxConstraint = new MaxNumberConstraint();
		const minConstraint = new MinNumberConstraint();
		model.addConstraint(maxConstraint);
		model.addConstraint(minConstraint);

		assert.strictEqual(
			model.findConstraintByClass(MaxNumberConstraint),
			maxConstraint
		);
		assert.strictEqual(
			model.findConstraintByClass(MinNumberConstraint),
			minConstraint
		);
	});

	it('should not add duplicated constraint', () => {
		const model = new PropertyModel();

		const c1 = new MaxNumberConstraint();
		const c2 = new MaxNumberConstraint();
		model.addConstraint(c1);

		assert.throws(() => {
			model.addconstraint(c2);
		});
	});
});
