import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {findConstraint} from '../plugin/common/constraint/composite';
import {RangeConstraint} from '../plugin/common/constraint/range';
import {StepConstraint} from '../plugin/common/constraint/step';
import {Point3dConstraint} from '../plugin/input-bindings/point-3d/constraint/point-3d';
import {Point3dTextController} from '../plugin/input-bindings/point-3d/controller/point-3d-text';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: Point3dTextController,
			params: {},
			value: {x: 12, y: 34, z: 56},
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
		const obj = {foo: {x: 12, y: 34, z: 56}};
		const bapi = pane.addInput(obj, 'foo', {
			z: {
				step: 1,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof Point3dConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const zc = c.z;
		if (!zc) {
			throw new Error('Unexpected constraint');
		}
		const sc = findConstraint(zc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34, z: 56}};
		const bapi = pane.addInput(obj, 'foo', {
			z: {
				max: 456,
				min: -123,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof Point3dConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const zc = c.z;
		if (!zc) {
			throw new Error('Unexpected constraint');
		}
		const rc = findConstraint(zc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});
});
