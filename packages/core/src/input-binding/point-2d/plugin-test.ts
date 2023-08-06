import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../../blade/binding/controller/input-binding.js';
import {Point2dInputParams} from '../../blade/common/api/params.js';
import {BindingTarget} from '../../common/binding/target.js';
import {InputBindingValue} from '../../common/binding/value/input-binding.js';
import {Constraint} from '../../common/constraint/constraint.js';
import {ComplexValue} from '../../common/model/complex-value.js';
import {getBoundValue} from '../../common/model/test-util.js';
import {Value} from '../../common/model/value.js';
import {getDimensionProps} from '../../common/point-nd/test-util.js';
import {createTestWindow} from '../../misc/dom-test-util.js';
import {Tuple2} from '../../misc/type-util.js';
import {PointNdConstraint} from '../common/constraint/point-nd.js';
import {createInputBindingController} from '../plugin.js';
import {Point2dController} from './controller/point-2d.js';
import {Point2d} from './model/point-2d.js';
import {getSuitableMax, Point2dInputPlugin} from './plugin.js';

function getPoint2dConstraint(
	v: InputBindingValue<unknown>,
): PointNdConstraint<Point2d> {
	return (getBoundValue(v) as ComplexValue<unknown>)
		.constraint as PointNdConstraint<Point2d>;
}

describe(getSuitableMax.name, () => {
	[
		{
			expected: 10,
			params: {
				params: {},
				rawValue: new Point2d(),
			},
		},
		{
			expected: 340,
			params: {
				params: {},
				rawValue: new Point2d(12, 34),
			},
		},
		{
			expected: 10,
			params: {
				params: {
					x: {min: 0, max: 10},
				},
				rawValue: new Point2d(),
			},
		},
		{
			expected: 100,
			params: {
				params: {
					y: {min: -100, max: 0},
				},
				rawValue: new Point2d(),
			},
		},
	].forEach((testCase) => {
		describe(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return ${testCase.expected}`, () => {
				const mv = getSuitableMax(
					testCase.params.params,
					testCase.params.rawValue,
				);
				assert.strictEqual(mv, testCase.expected);
			});
		});
	});
});

describe(Point2dInputPlugin.id, () => {
	it('should create appropriate step constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point2dInputPlugin, {
			document: doc,
			params: {
				x: {step: 1},
			},
			target: new BindingTarget({foo: {x: 12, y: 34}}, 'foo'),
		}) as InputBindingController;

		const constraint = getPoint2dConstraint(c.value);
		const xp = getDimensionProps(
			constraint.components[0] as Constraint<number>,
		);
		assert.strictEqual(xp.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point2dInputPlugin, {
			document: doc,
			params: {
				y: {max: 456, min: -123},
			},
			target: new BindingTarget({foo: {x: 12, y: 34}}, 'foo'),
		}) as InputBindingController;

		const constraint = getPoint2dConstraint(c.value);
		const yp = getDimensionProps(
			constraint.components[1] as Constraint<number>,
		);
		assert.deepStrictEqual([yp.min, yp.max], [-123, 456]);
	});

	it('should not break original object', () => {
		const doc = createTestWindow().document;
		const p = {x: 12, y: 34, hello: 'world'};
		const obj = {p: p};
		const c = createInputBindingController(Point2dInputPlugin, {
			document: doc,
			params: {
				y: {max: 456, min: -123},
			},
			target: new BindingTarget(obj, 'p'),
		});

		const v = c?.value as Value<Point2d>;
		v.rawValue = new Point2d(56, 78);
		assert.strictEqual(p, obj.p);
		assert.strictEqual(p.x, 56);
		assert.strictEqual(p.y, 78);
		assert.strictEqual(p.hello, 'world');
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
			],
		},
	].forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should propagate dimension params', () => {
				const doc = createTestWindow().document;
				const c = createInputBindingController(Point2dInputPlugin, {
					document: doc,
					params: params.params,
					target: new BindingTarget({p: {x: 12, y: 34}}, 'p'),
				}) as InputBindingController;

				const comps = getPoint2dConstraint(c.value).components;
				[0, 1].forEach((i) => {
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
				expected: ['bar', 'foo'],
			},
			{
				params: {
					format: () => 'foo',
					y: {format: () => 'bar'},
				},
				expected: ['foo', 'bar'],
			},
		] as {
			params: Point2dInputParams;
			expected: Tuple2<string>;
		}[]
	).forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should apply custom formatter', () => {
				const doc = createTestWindow().document;
				const c = createInputBindingController(Point2dInputPlugin, {
					document: doc,
					params: params,
					target: new BindingTarget({p: {x: 12, y: 34}}, 'p'),
				}) as InputBindingController;

				const vc = c.valueController as Point2dController;
				assert.deepStrictEqual(
					vc.textController.textControllers.map(
						(tc) => tc.view.inputElement.value,
					),
					expected,
				);
			});
		});
	});
});
