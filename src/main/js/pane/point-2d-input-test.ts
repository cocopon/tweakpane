import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {Point2dConstraint} from '../constraint/point-2d';
import {RangeConstraint} from '../constraint/range';
import {StepConstraint} from '../constraint/step';
import {ConstraintUtil} from '../constraint/util';
import {Point2dPadTextInputController} from '../controller/input/point-2d-pad-text';
import {TestUtil} from '../misc/test-util';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(PlainTweakpane.name, () => {
	[
		{
			expectedClass: Point2dPadTextInputController,
			params: {},
			value: {x: 12, y: 34},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const api = createPane();
				const obj = {foo: testCase.value};
				const bapi = api.addInput(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);
			});
		});
	});

	it('should create appropriate step constraint', () => {
		const api = createPane();
		const obj = {foo: {x: 12, y: 34}};
		const bapi = api.addInput(obj, 'foo', {
			x: {
				step: 1,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof Point2dConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const xc = c.xConstraint;
		if (!xc) {
			throw new Error('Unexpected constraint');
		}
		const sc = ConstraintUtil.findConstraint(xc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const api = createPane();
		const obj = {foo: {x: 12, y: 34}};
		const bapi = api.addInput(obj, 'foo', {
			y: {
				max: 456,
				min: -123,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof Point2dConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const yc = c.yConstraint;
		if (!yc) {
			throw new Error('Unexpected constraint');
		}
		const rc = ConstraintUtil.findConstraint(yc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});
});
