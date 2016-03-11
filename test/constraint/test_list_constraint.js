const ListConstraint = require('../../src/main/js/constraint/list_constraint');
const Constraint          = require('../../src/main/js/model/model');

describe('ListConstraint', () => {
	it('should not constrain value by default', () => {
		const c = new ListConstraint();

		assert.strictEqual(c.format('hello'), 'hello');
		assert.strictEqual(c.format(3.1416), 3.1416);
	});

	it('should have null value by default', () => {
		const c = new ListConstraint();

		assert.isNull(c.getItems());
	});

	it('should set value', () => {
		const c = new ListConstraint();
		const items = [
			{name: 'foo', value: 1},
			{name: 'bar', value: 2}
		];

		c.setItems(items);
		assert.strictEqual(c.getItems(), items);
	});

	it('should fire change event', () => {
		const c = new ListConstraint();

		const spy = sinon.spy();
		c.getEmitter().on(
			Constraint.EVENT_CHANGE,
			spy
		);
		c.setItems([
			{name: 'foo', value: 1}
		]);

		assert.isTrue(spy.calledOnce);
	});

	it('should constrain value', () => {
		const c = new ListConstraint();
		const items = [
			{name: 'foo', value: 1},
			{name: 'bar', value: 2}
		];

		c.setItems(items);

		assert.strictEqual(c.format(0), 1);
		assert.strictEqual(c.format(1), 1);
		assert.strictEqual(c.format(2), 2);
		assert.strictEqual(c.format(3), 1);
	});
});
