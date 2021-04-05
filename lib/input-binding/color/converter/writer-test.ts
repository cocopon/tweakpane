import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../../common/binding/target';
import {Color} from '../model/color';
import {writeRgbaColorObject, writeRgbColorObject} from './writer';

describe('writer/color', () => {
	it('should write RGBA color object value without destruction', () => {
		const obj = {
			foo: {r: 0, g: 127, b: 255, a: 0.5},
		};
		const objFoo = obj.foo;
		const t = new BindingTarget(obj, 'foo');
		writeRgbaColorObject(t, new Color([128, 255, 0, 0.7], 'rgb'));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.r, 128);
		assert.strictEqual(obj.foo.g, 255);
		assert.strictEqual(obj.foo.b, 0);
		assert.strictEqual(obj.foo.a, 0.7);
	});

	it('should write RGB color object value without destruction', () => {
		const obj = {
			foo: {r: 0, g: 127, b: 255, a: 0.5},
		};
		const objFoo = obj.foo;
		const t = new BindingTarget(obj, 'foo');
		writeRgbColorObject(t, new Color([128, 255, 0, 0.7], 'rgb'));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.r, 128);
		assert.strictEqual(obj.foo.g, 255);
		assert.strictEqual(obj.foo.b, 0);
		// should not overwrite alpha component
		assert.strictEqual(obj.foo.a, 0.5);
	});
});
