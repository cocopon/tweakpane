import {assert} from 'chai';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../../common/binding/target';
import {Point2d} from '../model/point-2d';
import {writePoint2d} from './point-2d';

describe('writer/point-2d', () => {
	it('should write value without destruction', () => {
		const obj = {
			foo: {x: 12, y: 34},
		};
		const objFoo = obj.foo;
		const t = new BindingTarget(obj, 'foo');
		writePoint2d(t, new Point2d(56, 78));

		assert.strictEqual(obj.foo, objFoo);
		assert.strictEqual(obj.foo.x, 56);
		assert.strictEqual(obj.foo.y, 78);
	});
});
