import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from './value-map';

describe(ValueMap.name, () => {
	it('should get initial value', () => {
		const m = ValueMap.fromObject({
			foo: 'bar',
			baz: 'qux',
		});
		assert.strictEqual(m.get('foo'), 'bar');
		assert.strictEqual(m.get('baz'), 'qux');
	});

	it('should set value', () => {
		const m = ValueMap.fromObject({
			foo: 'bar',
		});
		m.set('foo', 'baz');
		assert.strictEqual(m.get('foo'), 'baz');
	});

	it('should fire change event', (done) => {
		const m = ValueMap.fromObject({
			foo: 'bar',
			baz: 'qux',
		});

		m.emitter.on('change', (ev) => {
			assert.strictEqual(ev.key, 'baz');
			assert.strictEqual(m.get('baz'), 'changed');
			done();
		});
		m.set('baz', 'changed');
	});

	it('should not fire change event when setting the same value', () => {
		const m = ValueMap.fromObject({
			foo: 'bar',
		});

		m.emitter.on('change', () => {
			assert.fail('should not be called');
		});

		assert.doesNotThrow(() => {
			m.set('foo', 'bar');
		});
	});

	it('should return signle value emitter', (done) => {
		const m = ValueMap.fromObject({
			foo: 'bar',
			baz: 'qux',
		});

		m.value('baz').emitter.on('change', (ev) => {
			assert.strictEqual(ev.rawValue, 'changed');
			assert.strictEqual(m.get('baz'), 'changed');
			done();
		});
		m.set('baz', 'changed');
	});
});
