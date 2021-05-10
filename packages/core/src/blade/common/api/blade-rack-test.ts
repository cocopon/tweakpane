import * as assert from 'assert';
import {it} from 'mocha';

import {BladeRackApi} from './blade-rack';

export function testBladeContainer(createApi: () => BladeRackApi) {
	it('should implement children', () => {
		const api = createApi();
		const bapis = [api.addSeparator(), api.addSeparator(), api.addSeparator()];
		api.add(bapis[0]);
		api.add(bapis[1]);
		api.add(bapis[2]);
		assert.deepStrictEqual(api.children, bapis);
	});

	it('should implement addButton()', () => {
		const api = createApi();
		const bapi1 = api.addButton({title: 'foo'});
		assert.strictEqual(api.children[api.children.length - 1], bapi1);
		assert.strictEqual(bapi1.title, 'foo');

		const bapi2 = api.addButton({title: 'bar', index: 0});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addFolder()', () => {
		const api = createApi();
		const bapi1 = api.addFolder({title: 'foo'});
		assert.strictEqual(api.children[api.children.length - 1], bapi1);
		assert.strictEqual(bapi1.title, 'foo');

		const bapi2 = api.addFolder({title: 'bar', index: 0});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addSeparator()', () => {
		const api = createApi();
		const bapi1 = api.addSeparator();
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = api.addSeparator({index: 0});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addTab()', () => {
		const api = createApi();
		const bapi1 = api.addTab({pages: [{title: 'foo'}]});
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = api.addTab({index: 0, pages: [{title: 'bar'}]});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addInput()', () => {
		const api = createApi();
		const bapi1 = api.addInput({foo: 1}, 'foo');
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = api.addInput({foo: 1}, 'foo', {index: 0});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addMonitor()', () => {
		const api = createApi();
		const bapi1 = api.addMonitor({foo: 1}, 'foo');
		assert.strictEqual(api.children[api.children.length - 1], bapi1);
		bapi1.dispose();

		const bapi2 = api.addInput({foo: 1}, 'foo', {index: 0});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addBlade()', () => {
		const api = createApi();
		const bapi1 = api.addBlade({
			view: 'separator',
		});
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = api.addBlade({
			index: 0,
			view: 'separator',
		});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement remove()', () => {
		const api = createApi();
		const bapi = api.addSeparator();
		api.remove(bapi);
		assert.notStrictEqual(api.children[api.children.length - 1], bapi);
	});

	it('should implement add()', () => {
		const api = createApi();
		const bapi = api.addSeparator();
		api.remove(bapi);

		api.add(bapi);
		assert.strictEqual(api.children[api.children.length - 1], bapi);

		api.remove(bapi);
		api.add(bapi, 0);
		assert.strictEqual(api.children[0], bapi);
	});

	it('should move to the last when re-adding child', () => {
		const api = createApi();
		const bapi = api.addSeparator();
		api.addSeparator();
		api.add(bapi);

		assert.strictEqual(api.children.length, 2);
		assert.notStrictEqual(api.children[0], bapi);
		assert.strictEqual(api.children[1], bapi);
	});

	it('should be removed from previous parent', () => {
		const api1 = createApi();
		const bapi = api1.addSeparator();
		api1.add(bapi);
		const api2 = createApi();
		api2.add(bapi);

		assert.strictEqual(api1.children.length, 0);
		assert.strictEqual(api2.children[0], bapi);
	});
}
