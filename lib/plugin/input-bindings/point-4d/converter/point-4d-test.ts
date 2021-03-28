import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../../common/binding/target';
import {Point4d} from '../model/point-4d';
import {writePoint4d} from './point-4d';

describe(writePoint4d.name, () => {
	it('should write value without destruction', () => {
		const obj = {
			foo: {x: 12, y: 34, z: -56, w: 78},
		};
		const objFoo = obj.foo;
		const t = new BindingTarget(obj, 'foo');
		writePoint4d(t, new Point4d(56, 78, 901, 23));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.x, 56);
		assert.strictEqual(obj.foo.y, 78);
		assert.strictEqual(obj.foo.z, 901);
		assert.strictEqual(obj.foo.w, 23);
	});
});
