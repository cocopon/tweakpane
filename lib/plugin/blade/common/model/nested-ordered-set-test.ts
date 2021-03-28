import * as assert from 'assert';
import {describe, it} from 'mocha';

import {NestedOrderedSet} from './nested-ordered-set';

class Item {
	public readonly id: string;

	constructor(id: string) {
		this.id = id;
	}
}

class ContainerItem extends Item {
	public readonly subitems: NestedOrderedSet<Item>;

	constructor(id: string, subitems: NestedOrderedSet<Item>) {
		super(id);
		this.subitems = subitems;
	}
}

function extractor(item: Item): NestedOrderedSet<Item> | null {
	return item instanceof ContainerItem ? item.subitems : null;
}

describe(NestedOrderedSet.name, () => {
	it('should add item', () => {
		const s = new NestedOrderedSet(extractor);

		const i0 = new Item('foo');
		s.add(i0);
		assert.strictEqual(s.items[0], i0);
		assert.strictEqual(s.allItems().includes(i0), true);

		const i1 = new Item('bar');
		s.add(i1);
		assert.strictEqual(s.items[1], i1);
		assert.strictEqual(s.allItems().includes(i1), true);
	});

	it('should insert item', () => {
		const s = new NestedOrderedSet(extractor);

		s.add(new Item('foo'));
		const i = new Item('bar');
		s.add(i, 0);

		assert.strictEqual(s.items[0], i);
		assert.strictEqual(s.allItems().includes(i), true);
	});

	it('should not add duplicated item', () => {
		const s = new NestedOrderedSet(extractor);
		const i = new Item('foo');

		s.add(i);
		assert.throws(() => {
			s.add(i);
		});
	});

	it('should fire add event', (done) => {
		const s = new NestedOrderedSet(extractor);
		s.add(new Item('foo'));

		const i = new Item('bar');
		s.emitter.on('add', (ev) => {
			assert.strictEqual(ev.target, s);
			assert.strictEqual(ev.root, s);
			assert.strictEqual(ev.item, i);
			assert.strictEqual(ev.index, 1);
			done();
		});

		s.add(i);
	});

	it('should remove item', () => {
		const s = new NestedOrderedSet(extractor);
		const i = new Item('foo');
		s.add(i);

		assert.strictEqual(s.allItems().includes(i), true);
		s.remove(i);
		assert.strictEqual(s.allItems().includes(i), false);
	});

	it('should not remove unrelated item', () => {
		const s = new NestedOrderedSet(extractor);
		s.add(new Item('foo'));

		assert.strictEqual(s.allItems().length, 1);
		s.remove(new Item('bar'));
		assert.strictEqual(s.allItems().length, 1);
	});

	it('should fire remove event', (done) => {
		const s = new NestedOrderedSet(extractor);
		s.add(new Item('foo'));
		const i = new Item('bar');
		s.add(i);

		s.emitter.on('remove', (ev) => {
			assert.strictEqual(ev.item, i);
			assert.strictEqual(ev.root, s);
			assert.strictEqual(ev.target, s);
			done();
		});
		s.remove(i);
	});

	it('should fire add event of subset', (done) => {
		const s = new NestedOrderedSet(extractor);
		const i0 = new ContainerItem('foo', new NestedOrderedSet(extractor));
		i0.subitems.add(new Item('bar'));
		s.add(i0);

		const i1 = new Item('baz');
		s.emitter.on('add', (ev) => {
			assert.strictEqual(ev.target, i0.subitems);
			assert.strictEqual(ev.root, s);
			assert.strictEqual(ev.item, i1);
			assert.strictEqual(ev.index, 1);
			done();
		});

		i0.subitems.add(i1);
	});

	it('should fire remove event of subset', (done) => {
		const s = new NestedOrderedSet(extractor);
		const i0 = new ContainerItem('foo', new NestedOrderedSet(extractor));
		i0.subitems.add(new Item('bar'));
		s.add(i0);
		const i1 = new Item('baz');
		i0.subitems.add(i1);

		s.emitter.on('remove', (ev) => {
			assert.strictEqual(ev.target, i0.subitems);
			assert.strictEqual(ev.root, s);
			assert.strictEqual(ev.item, i1);
			done();
		});

		i0.subitems.remove(i1);
	});

	it('should not fire event of removed subset', () => {
		const s = new NestedOrderedSet(extractor);
		const i0 = new ContainerItem('foo', new NestedOrderedSet(extractor));
		s.add(i0);

		s.emitter.on('add', () => {
			assert.fail('should not be called');
		});

		s.remove(i0);
		assert.doesNotThrow(() => {
			i0.subitems.add(new Item('bar'));
		});
	});

	it('should find item', () => {
		const s = new NestedOrderedSet(extractor);

		s.add(new Item('foo'));
		const ibar = new Item('bar');
		s.add(ibar);
		s.add(new Item('baz'));
		assert.strictEqual(
			s.find((i) => i.id === 'bar'),
			ibar,
		);

		assert.strictEqual(
			s.find((i) => i.id === 'qux'),
			null,
		);
	});

	it('should find item (nested)', () => {
		const s = new NestedOrderedSet(extractor);

		s.add(new Item('foo'));

		const icon = new ContainerItem(
			'container',
			new NestedOrderedSet(extractor),
		);
		const ibar = new Item('bar');
		icon.subitems.add(ibar);
		s.add(icon);
		s.add(new Item('baz'));
		assert.strictEqual(
			s.find((i) => i.id === 'bar'),
			ibar,
		);
	});
});
