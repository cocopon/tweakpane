import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../../blade/binding/controller/input-binding.js';
import {Point3dInputParams} from '../../blade/common/api/params.js';
import {BindingTarget} from '../../common/binding/target.js';
import {InputBindingValue} from '../../common/binding/value/input-binding.js';
import {findConstraint} from '../../common/constraint/composite.js';
import {Constraint} from '../../common/constraint/constraint.js';
import {StepConstraint} from '../../common/constraint/step.js';
import {ComplexValue} from '../../common/model/complex-value.js';
import {getBoundValue} from '../../common/model/test-util.js';
import {getDimensionProps} from '../../common/point-nd/test-util.js';
import {createTestWindow} from '../../misc/dom-test-util.js';
import {Tuple3} from '../../misc/type-util.js';
import {PointNdConstraint} from '../common/constraint/point-nd.js';
import {PointNdTextController} from '../common/controller/point-nd-text.js';
import {createInputBindingController} from '../plugin.js';
import {Point3d} from './model/point-3d.js';
import {Point3dInputPlugin} from './plugin.js';

function getPoint3dConstraint(
	v: InputBindingValue<unknown>,
): PointNdConstraint<Point3d> {
	return (getBoundValue(v) as ComplexValue<unknown>)
		.constraint as PointNdConstraint<Point3d>;
}

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
		}) as InputBindingController;

		const cs = getPoint3dConstraint(c.value);
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
		}) as InputBindingController;

		const cs = getPoint3dConstraint(c.value);
		const zp = getDimensionProps(cs.components[2] as Constraint<number>);
		assert.deepStrictEqual([zp.min, zp.max], [-123, 456]);
	});

	[
		{
			params: {
				params: {
					...{min: -1, max: 1, step: 0.1},
					x: {min: -2, max: 2, step: 0.2},
				},
			},
			expected: [
				{min: -2, max: 2, step: 0.2},
				{min: -1, max: 1, step: 0.1},
				{min: -1, max: 1, step: 0.1},
			],
		},
		{
			params: {
				params: {
					...{min: -1, max: 1, step: 0.1},
					y: {min: -2, max: 2, step: 0.2},
				},
			},
			expected: [
				{min: -1, max: 1, step: 0.1},
				{min: -2, max: 2, step: 0.2},
				{min: -1, max: 1, step: 0.1},
			],
		},
		{
			params: {
				params: {
					...{min: -1, max: 1, step: 0.1},
					z: {min: -2, max: 2, step: 0.2},
				},
			},
			expected: [
				{min: -1, max: 1, step: 0.1},
				{min: -1, max: 1, step: 0.1},
				{min: -2, max: 2, step: 0.2},
			],
		},
	].forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should propagate dimension params', () => {
				const doc = createTestWindow().document;
				const c = createInputBindingController(Point3dInputPlugin, {
					document: doc,
					params: params.params,
					target: new BindingTarget({p: {x: 12, y: 34, z: 56}}, 'p'),
				}) as InputBindingController;

				const comps = getPoint3dConstraint(c.value).components;
				[0, 1, 2].forEach((i) => {
					const p = getDimensionProps(comps[i] as Constraint<number>);
					assert.deepStrictEqual(p, expected[i]);
				});
			});
		});
	});

	(
		[
			{
				params: {
					format: () => 'foo',
					x: {format: () => 'bar'},
				},
				expected: ['bar', 'foo', 'foo'],
			},
			{
				params: {
					format: () => 'foo',
					y: {format: () => 'bar'},
				},
				expected: ['foo', 'bar', 'foo'],
			},
			{
				params: {
					format: () => 'foo',
					z: {format: () => 'bar'},
				},
				expected: ['foo', 'foo', 'bar'],
			},
		] as {
			params: Point3dInputParams;
			expected: Tuple3<string>;
		}[]
	).forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should apply custom formatter', () => {
				const doc = createTestWindow().document;
				const c = createInputBindingController(Point3dInputPlugin, {
					document: doc,
					params: params,
					target: new BindingTarget({p: {x: 12, y: 34, z: 56}}, 'p'),
				}) as InputBindingController;

				const vc = c.valueController as PointNdTextController<Point3d>;
				assert.deepStrictEqual(
					vc.textControllers.map((tc) => tc.view.inputElement.value),
					expected,
				);
			});
		});
	});
});
