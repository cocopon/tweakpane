import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {createApi} from '../../blade';
import {TextBladeApi} from './api/text';
import {TextBladePlugin, TextParams} from './plugin';

describe(TextBladePlugin.id, () => {
	it('should apply initial params', () => {
		const doc = TestUtil.createWindow().document;
		const formatter = (v: string) => `${v}, world`;
		const api = createApi(TextBladePlugin, {
			document: doc,
			params: {
				format: formatter,
				label: 'hello',
				parse: (v: string) => v,
				value: 'hello',
				view: 'text',
			} as TextParams<string>,
		}) as TextBladeApi<string>;

		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(api.value, 'hello');
		assert.strictEqual(
			api.controller_.view.element.querySelector('.tp-lblv_l')?.textContent,
			'hello',
		);
	});

	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(TextBladePlugin, {
			document: doc,
			params: {
				parse: (v: string) => v,
				value: 'hello',
				view: 'text',
			} as TextParams<string>,
		}) as TextBladeApi<string>;
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(TextBladePlugin, {
			document: doc,
			params: {
				disabled: true,
				parse: (v: string) => v,
				value: 'hello',
				view: 'text',
			} as TextParams<string>,
		}) as TextBladeApi<string>;

		assert.strictEqual(api.disabled, true);
		api.disabled = false;
		assert.strictEqual(api.disabled, false);

		assert.strictEqual(api.hidden, false);
		api.hidden = true;
		assert.strictEqual(api.hidden, true);

		const inputElem = api.controller_.valueController.view.inputElement;
		const formatter = (v: string) => `${v}, world`;
		assert.strictEqual(inputElem.value, 'hello');
		api.formatter = formatter;
		assert.strictEqual(api.formatter, formatter);
		assert.strictEqual(inputElem.value, 'hello, world');

		api.value = 'changed';
		assert.strictEqual(api.value, 'changed');
	});

	it('should handle event', (done) => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(TextBladePlugin, {
			document: doc,
			params: {
				parse: (v: string) => v,
				value: 'hello',
				view: 'text',
			} as TextParams<string>,
		}) as TextBladeApi<string>;

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 'changed');
			done();
		});
		api.value = 'changed';
	});
});
