import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../../common/binding/target';
import {Point3d} from '../model/point-3d';
import {writePoint3d} from './point-3d';

describe(writePoint3d.name, () => {
	it('should write value without destruction', () => {
		const obj = {
			foo: {x: 12, y: 34, z: -56},
		};
		const objFoo = obj.foo;
		const t = new BindingTarget(obj, 'foo');
		writePoint3d(t, new Point3d(56, 78, 901));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.x, 56);
		assert.strictEqual(obj.foo.y, 78);
		assert.strictEqual(obj.foo.z, 901);
	});
});
