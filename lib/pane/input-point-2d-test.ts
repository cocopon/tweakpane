import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {findConstraint} from '../common/constraint/composite';
import {RangeConstraint} from '../common/constraint/range';
import {StepConstraint} from '../common/constraint/step';
import {BoundValue} from '../common/model/bound-value';
import Tweakpane from '../index';
import {PointNdConstraint} from '../input-binding/common/constraint/point-nd';
import {Point2dPadTextController} from '../input-binding/point-2d/controller/point-2d-pad-text';
import {Point2d} from '../input-binding/point-2d/model/point-2d';
import {TestUtil} from '../misc/test-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: Point2dPadTextController,
			params: {},
			value: {x: 12, y: 34},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);
				assert.strictEqual(
					bapi.controller_.controller instanceof testCase.expectedClass,
					true,
				);
			});
		});
	});

	it('should create appropriate step constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34}};
		const bapi = pane.addInput(obj, 'foo', {
			x: {
				step: 1,
			},
		});

		const c = (bapi.controller_.binding.value as BoundValue<unknown>)
			.constraint;
		if (!(c instanceof PointNdConstraint)) {
			assert.fail('Unexpected constraint');
		}
		const xc = c.components[0];
		if (!xc) {
			assert.fail('Unexpected constraint');
		}
		const sc = findConstraint(xc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34}};
		const bapi = pane.addInput(obj, 'foo', {
			y: {
				max: 456,
				min: -123,
			},
		});

		const c = (bapi.controller_.binding.value as BoundValue<unknown>)
			.constraint;
		if (!(c instanceof PointNdConstraint)) {
			assert.fail('Unexpected constraint');
		}
		const yc = c.components[1];
		if (!yc) {
			assert.fail('Unexpected constraint');
		}
		const rc = findConstraint(yc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});

	it('should not break original object', () => {
		const pane = createPane();
		const p = {x: 12, y: 34, hello: 'world'};
		const obj = {p: p};
		const bapi = pane.addInput(obj, 'p');

		const v = bapi.controller_.binding.value;
		if (!(v.rawValue instanceof Point2d)) {
			assert.fail('Unexpected value type');
		}

		v.rawValue = new Point2d(56, 78);
		assert.strictEqual(p, obj.p);
		assert.strictEqual(p.x, 56);
		assert.strictEqual(p.y, 78);
		assert.strictEqual(p.hello, 'world');
	});
});
