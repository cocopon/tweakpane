import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {createApi} from '../plugin';
import {ListBladeApi} from './api/list';
import {ListBladeParams, ListBladePlugin} from './plugin';

describe(ListBladePlugin.id, () => {
	[
		{},
		{
			view: 'list',
		},
		{
			value: 123,
			view: 'list',
		},
		{
			options: {foo: 1},
			view: 'list',
		},
		{
			value: 123,
			options: 'invalid',
			view: 'list',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = TestUtil.createWindow().document;
				const api = createApi(ListBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(api, null);
			});
		});
	});

	[
		{
			value: 0,
			options: [],
			view: 'list',
		},
	].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should create API', () => {
				const doc = TestUtil.createWindow().document;
				const api = createApi(ListBladePlugin, {
					document: doc,
					params: params,
				});
				assert.notStrictEqual(api, null);
			});
		});
	});

	it('should apply initial params', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(ListBladePlugin, {
			document: doc,
			params: {
				label: 'hello',
				options: {
					foo: 1,
					bar: 2,
				},
				value: 123,
				view: 'list',
			} as ListBladeParams<number>,
		}) as ListBladeApi<number>;

		assert.strictEqual(api.value, 123);
		assert.deepStrictEqual(api.options[0], {text: 'foo', value: 1});
		assert.deepStrictEqual(api.options[1], {text: 'bar', value: 2});
		assert.strictEqual(
			api.controller_.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});
});
