import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {BindingTarget} from '../../common/binding/target';
import {findConstraint} from '../../common/constraint/composite';
import {RangeConstraint} from '../../common/constraint/range';
import {StepConstraint} from '../../common/constraint/step';
import {BoundValue} from '../../common/model/bound-value';
import {Value} from '../../common/model/value';
import {createTestWindow} from '../../misc/dom-test-util';
import {PointNdConstraint} from '../common/constraint/point-nd';
import {createInputBindingController} from '../plugin';
import {Point2d, Point2dAssembly} from './model/point-2d';
import {getSuitableMaxValue, Point2dInputPlugin} from './plugin';

describe(getSuitableMaxValue.name, () => {
	[
		{
			expected: 10,
			params: {
				constraint: undefined,
				rawValue: new Point2d(),
			},
		},
		{
			expected: 340,
			params: {
				constraint: undefined,
				rawValue: new Point2d(12, 34),
			},
		},
		{
			expected: 10,
			params: {
				constraint: new PointNdConstraint({
					assembly: Point2dAssembly,
					components: [new RangeConstraint({min: 0, max: 10})],
				}),
				rawValue: new Point2d(),
			},
		},
		{
			expected: 100,
			params: {
				constraint: new PointNdConstraint({
					assembly: Point2dAssembly,
					components: [undefined, new RangeConstraint({min: -100, max: 0})],
				}),
				rawValue: new Point2d(),
			},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return ${testCase.expected}`, () => {
				const mv = getSuitableMaxValue(
					testCase.params.rawValue,
					testCase.params.constraint,
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
		});

		const constraint = (c?.binding.value as BoundValue<unknown>)
			.constraint as PointNdConstraint<Point2d>;
		const xc = constraint.components[0];
		if (!xc) {
			assert.fail('Unexpected constraint');
		}
		const sc = findConstraint(xc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const doc = createTestWindow().document;
		const c = createInputBindingController(Point2dInputPlugin, {
			document: doc,
			params: {
				y: {max: 456, min: -123},
			},
			target: new BindingTarget({foo: {x: 12, y: 34}}, 'foo'),
		});

		const constraint = (c?.binding.value as BoundValue<unknown>)
			.constraint as PointNdConstraint<Point2d>;
		const yc = constraint.components[1];
		if (!yc) {
			assert.fail('Unexpected constraint');
		}
		const rc = findConstraint(yc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
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

		const v = c?.binding.value as Value<Point2d>;
		v.rawValue = new Point2d(56, 78);
		assert.strictEqual(p, obj.p);
		assert.strictEqual(p.x, 56);
		assert.strictEqual(p.y, 78);
		assert.strictEqual(p.hello, 'world');
	});
});
