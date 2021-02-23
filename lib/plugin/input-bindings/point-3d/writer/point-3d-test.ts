import {assert} from 'chai';
import {describe, it} from 'mocha';

import {Target} from '../../../common/model/target';
import {Point3d} from '../model/point-3d';
import {writePoint3d} from './point-3d';

describe('writer/point-2d', () => {
	it('should write value', () => {
		const obj = {
			foo: {x: 12, y: 34, z: -56},
		};
		const objFoo = obj.foo;
		const t = new Target(obj, 'foo');
		writePoint3d(t, new Point3d(56, 78, 901));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.x, 56);
		assert.strictEqual(obj.foo.y, 78);
		assert.strictEqual(obj.foo.z, 901);
	});
});
