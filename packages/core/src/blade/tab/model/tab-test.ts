import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createValue} from '../../../common/model/values';
import {Tab} from './tab';

describe(Tab.name, () => {
	it('should have initial state', () => {
		const t = new Tab();
		assert.strictEqual(t.empty.rawValue, true);
		assert.strictEqual(t.selectedIndex.rawValue, -1);
	});

	it('should select first page by default', () => {
		const t = new Tab();
		const items = [createValue(false), createValue(false), createValue(false)];

		t.add(items[0]);
		assert.strictEqual(t.empty.rawValue, false);
		assert.strictEqual(t.selectedIndex.rawValue, 0);
		assert.strictEqual(items[0].rawValue, true);
		assert.deepStrictEqual(
			items.map((i) => i.rawValue),
			[true, false, false],
		);
	});

	it('should insert item at specific position', () => {
		const t = new Tab();
		const items = [createValue(false), createValue(false), createValue(false)];
		t.add(items[0]);
		t.add(items[1]);
		t.add(items[2], 1);
		items[2].rawValue = true;
		assert.strictEqual(t.selectedIndex.rawValue, 1);
	});

	it('should change selection', () => {
		const t = new Tab();
		const items = [createValue(false), createValue(false), createValue(false)];
		items.forEach((i) => t.add(i));

		items[1].rawValue = true;
		assert.deepStrictEqual(
			items.map((i) => i.rawValue),
			[false, true, false],
		);
		items[0].rawValue = true;
		assert.deepStrictEqual(
			items.map((i) => i.rawValue),
			[true, false, false],
		);
		items[2].rawValue = true;
		assert.deepStrictEqual(
			items.map((i) => i.rawValue),
			[false, false, true],
		);
	});

	it('should change selected index', () => {
		const t = new Tab();
		const items = [createValue(false), createValue(false), createValue(false)];
		items.forEach((i) => t.add(i));

		const selectedIndexes: number[] = [];
		t.selectedIndex.emitter.on('change', (ev) => {
			selectedIndexes.push(ev.rawValue);
		});
		items[1].rawValue = true;
		items[2].rawValue = true;
		items[0].rawValue = true;
		assert.deepStrictEqual(selectedIndexes, [1, 2, 0]);
	});

	it('should remove item', () => {
		const t = new Tab();
		const items = [createValue(false)];
		t.add(items[0]);
		t.remove(items[0]);
		assert.strictEqual(t.empty.rawValue, true);
		assert.strictEqual(t.selectedIndex.rawValue, -1);
	});

	it('should not remove unrelated item', () => {
		const t = new Tab();
		t.add(createValue<boolean>(false));
		t.remove(createValue<boolean>(false));
		assert.strictEqual(t.empty.rawValue, false);
		assert.strictEqual(t.selectedIndex.rawValue, 0);
	});
});
