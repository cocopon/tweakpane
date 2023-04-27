import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../../blade/binding/controller/input-binding.js';
import {Point4dInputParams} from '../../blade/common/api/params.js';
import {BindingTarget} from '../../common/binding/target.js';
import {InputBindingValue} from '../../common/binding/value/input-binding.js';
import {Constraint} from '../../common/constraint/constraint.js';
import {ComplexValue} from '../../common/model/complex-value.js';
import {getBoundValue} from '../../common/model/test-util.js';
import {getDimensionProps} from '../../common/point-nd/test-util.js';
import {createTestWindow} from '../../misc/dom-test-util.js';
import {Tuple4} from '../../misc/type-util.js';
import {PointNdConstraint} from '../common/constraint/point-nd.js';
import {PointNdTextController} from '../common/controller/point-nd-text.js';
import {createInputBindingController} from '../plugin.js';
import {Point4d} from './model/point-4d.js';
import {Point4dInputPlugin} from './plugin.js';

function getPoint4dConstraint(
	v: InputBindingValue<unknown>,
): PointNdConstraint<Point4d> {
	return (getBoundValue(v) as ComplexValue<unknown>)
		.constraint as PointNdConstraint<Point4d>;
}

describe(Point4dInputPlugin.id, () => {
	it('should have right number of text views', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point4dInputPlugin, {
			document: doc,
			params: {},
			target: new BindingTarget({foo: {x: 12, y: 34, z: 56, w: 78}}, 'foo'),
		});

		const vc = c?.valueController as PointNdTextController<Point4d>;
		assert.strictEqual(vc.view.textViews.length, 4);
	});

	it('should create appropriate step constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point4dInputPlugin, {
			document: doc,
			params: {w: {step: 1}},
			target: new BindingTarget({foo: {x: 12, y: 34, z: 56, w: 78}}, 'foo'),
		}) as InputBindingController;

		const cs = getPoint4dConstraint(c.value);
		const wp = getDimensionProps(cs.components[3] as Constraint<number>);
		assert.strictEqual(wp.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point4dInputPlugin, {
			document: doc,
			params: {w: {max: 456, min: -123}},
			target: new BindingTarget({foo: {x: 12, y: 34, z: 56, w: 78}}, 'foo'),
		}) as InputBindingController;

		const cs = getPoint4dConstraint(c.value);
		const wp = getDimensionProps(cs.components[3] as Constraint<number>);
		assert.deepStrictEqual([wp.min, wp.max], [-123, 456]);
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
				{min: -1, max: 1, step: 0.1},
			],
		},
		{
			params: {
				params: {
					...{min: -1, max: 1, step: 0.1},
					w: {min: -2, max: 2, step: 0.2},
				},
			},
			expected: [
				{min: -1, max: 1, step: 0.1},
				{min: -1, max: 1, step: 0.1},
				{min: -1, max: 1, step: 0.1},
				{min: -2, max: 2, step: 0.2},
			],
		},
	].forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should propagate dimension params', () => {
				const doc = createTestWindow().document;
				const c = createInputBindingController(Point4dInputPlugin, {
					document: doc,
					params: params.params,
					target: new BindingTarget({p: {x: 12, y: 34, z: 56, w: 78}}, 'p'),
				}) as InputBindingController;

				const comps = getPoint4dConstraint(c.value).components;
				[0, 1, 2, 3].forEach((i) => {
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
				expected: ['bar', 'foo', 'foo', 'foo'],
			},
			{
				params: {
					format: () => 'foo',
					y: {format: () => 'bar'},
				},
				expected: ['foo', 'bar', 'foo', 'foo'],
			},
			{
				params: {
					format: () => 'foo',
					z: {format: () => 'bar'},
				},
				expected: ['foo', 'foo', 'bar', 'foo'],
			},
			{
				params: {
					format: () => 'foo',
					w: {format: () => 'bar'},
				},
				expected: ['foo', 'foo', 'foo', 'bar'],
			},
		] as {
			params: Point4dInputParams;
			expected: Tuple4<string>;
		}[]
	).forEach(({params, expected}) => {
		describe(`when params=${JSON.stringify(params)}`, () => {
			it('should apply custom formatter', () => {
				const doc = createTestWindow().document;
				const c = createInputBindingController(Point4dInputPlugin, {
					document: doc,
					params: params,
					target: new BindingTarget({p: {x: 12, y: 34, z: 56, w: 78}}, 'p'),
				}) as InputBindingController;

				const vc = c.valueController as PointNdTextController<Point4d>;
				assert.deepStrictEqual(
					vc.textControllers.map((tc) => tc.view.inputElement.value),
					expected,
				);
			});
		});
	});
});
