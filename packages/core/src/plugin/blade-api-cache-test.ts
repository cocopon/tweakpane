import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	createAppropriateBladeApi,
	createAppropriateBladeController,
} from '../blade/test-util.js';
import {createTestWindow} from '../misc/dom-test-util.js';
import {BladeApiCache} from './blade-api-cache.js';

describe(BladeApiCache.name, () => {
	it('should add cache', () => {
		const doc = createTestWindow().document;
		const bc = createAppropriateBladeController(doc);
		const api = createAppropriateBladeApi(doc);
		const cache = new BladeApiCache();

		assert.strictEqual(cache.get(bc), null);
		cache.add(bc, api);
		assert.strictEqual(cache.get(bc), api);
	});

	it('should get existance', () => {
		const doc = createTestWindow().document;
		const bc = createAppropriateBladeController(doc);
		const api = createAppropriateBladeApi(doc);
		const cache = new BladeApiCache();

		assert.strictEqual(cache.has(bc), false);
		cache.add(bc, api);
		assert.strictEqual(cache.has(bc), true);
	});

	it('should remove disposed API', () => {
		const doc = createTestWindow().document;
		const bc = createAppropriateBladeController(doc);
		const api = createAppropriateBladeApi(doc);
		const cache = new BladeApiCache();

		api.dispose();
		assert.strictEqual(cache.has(bc), false);
	});
});
