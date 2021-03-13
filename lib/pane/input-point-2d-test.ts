import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {findConstraint} from '../plugin/common/constraint/composite';
import {RangeConstraint} from '../plugin/common/constraint/range';
import {StepConstraint} from '../plugin/common/constraint/step';
import {PointNdConstraint} from '../plugin/input-bindings/point-2d/constraint/point-nd';
import {Point2dPadTextController} from '../plugin/input-bindings/point-2d/controller/point-2d-pad-text';
import {Point2d} from '../plugin/input-bindings/point-2d/model/point-2d';

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
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
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

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const xc = c.components[0];
		if (!xc) {
			throw new Error('Unexpected constraint');
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

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const yc = c.components[1];
		if (!yc) {
			throw new Error('Unexpected constraint');
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

		const v = bapi.controller.binding.value;
		if (!(v.rawValue instanceof Point2d)) {
			throw new Error('Unexpected value type');
		}

		v.rawValue = new Point2d(56, 78);
		assert.strictEqual(p, obj.p);
		assert.strictEqual(p.x, 56);
		assert.strictEqual(p.y, 78);
		assert.strictEqual(p.hello, 'world');
	});
});
