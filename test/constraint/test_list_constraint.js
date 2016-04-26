const ListConstraint = require('../../src/main/js/constraint/list_constraint');

describe('ListConstraint', () => {
	it('should set value', () => {
		const items = [
			{name: 'foo', value: 1},
			{name: 'bar', value: 2}
		];
		const c = new ListConstraint(items);

		assert.strictEqual(c.getItems(), items);
	});

	it('should constrain value', () => {
		const items = [
			{name: 'foo', value: 1},
			{name: 'bar', value: 2}
		];
		const c = new ListConstraint(items);

		assert.strictEqual(c.constrain(0), 1);
		assert.strictEqual(c.constrain(1), 1);
		assert.strictEqual(c.constrain(2), 2);
		assert.strictEqual(c.constrain(3), 1);
	});
});
