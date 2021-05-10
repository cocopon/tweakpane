import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../../common/binding/target';
import {findConstraint} from '../../common/constraint/composite';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {BoundValue} from '../../common/model/bound-value';
import {createTestWindow} from '../../misc/dom-test-util';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {PointNdTextController} from '../common/controller/point-nd-text';
import {createInputBindingController} from '../plugin';
import {Point3d} from './model/point-3d';
import {Point3dInputPlugin} from './plugin';

describe(Point3dInputPlugin.id, () => {
	it('should have right number of text views', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point3dInputPlugin, {
			document: doc,
			params: {},
			target: new BindingTarget({foo: {x: 12, y: 34, z: 56}}, 'foo'),
		});

		const vc = c?.valueController as PointNdTextController<Point3d>;
		assert.strictEqual(vc.view.textViews.length, 3);
	});

	it('should create appropriate step constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point3dInputPlugin, {
			document: doc,
			params: {z: {step: 1}},
			target: new BindingTarget({foo: {x: 12, y: 34, z: 56}}, 'foo'),
		});

		const cs = (c?.binding.value as BoundValue<unknown>)
			.constraint as PointNdConstraint<Point3d>;
		const zc = cs.components[2];
		if (!zc) {
			assert.fail('Unexpected constraint');
		}
		const sc = findConstraint(zc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point3dInputPlugin, {
			document: doc,
			params: {
				z: {
					max: 456,
					min: -123,
				},
			},
			target: new BindingTarget({foo: {x: 12, y: 34, z: 56}}, 'foo'),
		});

		const cs = (c?.binding.value as BoundValue<unknown>)
			.constraint as PointNdConstraint<Point3d>;
		const zc = cs.components[2];
		if (!zc) {
			assert.fail('Unexpected constraint');
		}
		const rc = findConstraint(zc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});
});
