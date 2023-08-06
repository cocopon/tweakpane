import * as assert from 'assert';
import {it} from 'mocha';

import {ContainerApi} from './container.js';

function addSomeBladeApi(api: ContainerApi, opt_index?: number) {
	return api.addBlade({
		index: opt_index,
		view: 'test',
	});
}

export function testBladeContainer(createApi: () => ContainerApi) {
	it('should implement children', () => {
		const api = createApi();
		const bapis = [
			addSomeBladeApi(api),
			addSomeBladeApi(api),
			addSomeBladeApi(api),
		];
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

	it('should implement addTab()', () => {
		const api = createApi();
		const bapi1 = api.addTab({pages: [{title: 'foo'}]});
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = api.addTab({index: 0, pages: [{title: 'bar'}]});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addBinding() (input)', () => {
		const api = createApi();
		const bapi1 = api.addBinding({foo: 1}, 'foo');
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = api.addBinding({foo: 1}, 'foo', {index: 0});
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addBinding() (monitor)', () => {
		const api = createApi();
		const bapi1 = api.addBinding(
			{
				foo: 1,
				readonly: true,
			},
			'foo',
		);
		assert.strictEqual(api.children[api.children.length - 1], bapi1);
		bapi1.dispose();

		const bapi2 = api.addBinding(
			{
				foo: 1,
				readonly: true,
			},
			'foo',
			{index: 0},
		);
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement addBlade()', () => {
		const api = createApi();
		const bapi1 = addSomeBladeApi(api);
		assert.strictEqual(api.children[api.children.length - 1], bapi1);

		const bapi2 = addSomeBladeApi(api, 0);
		assert.strictEqual(api.children[0], bapi2);
	});

	it('should implement remove()', () => {
		const api = createApi();
		const bapi = addSomeBladeApi(api);
		api.remove(bapi);
		assert.notStrictEqual(api.children[api.children.length - 1], bapi);
	});

	it('should implement add()', () => {
		const api = createApi();
		const bapi = addSomeBladeApi(api);
		api.remove(bapi);

		api.add(bapi);
		assert.strictEqual(api.children[api.children.length - 1], bapi);

		api.remove(bapi);
		api.add(bapi, 0);
		assert.strictEqual(api.children[0], bapi);
	});

	it('should move to the last when re-adding child', () => {
		const api = createApi();
		const bapi1 = addSomeBladeApi(api);
		const bapi2 = addSomeBladeApi(api);
		api.add(bapi1);

		assert.deepStrictEqual(api.children, [bapi2, bapi1]);
	});

	it('should be removed from previous parent', () => {
		const api1 = createApi();
		const bapi = addSomeBladeApi(api1);
		api1.add(bapi);
		const api2 = createApi();
		api2.add(bapi);

		assert.deepStrictEqual(api1.children, []);
		assert.deepStrictEqual(api2.children, [bapi]);
	});
}
