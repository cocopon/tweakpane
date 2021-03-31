import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {findConstraint} from '../common/constraint/composite';
import {RangeConstraint} from '../common/constraint/range';
import {StepConstraint} from '../common/constraint/step';
import {BoundValue} from '../common/model/bound-value';
import Tweakpane from '../index';
import {PointNdConstraint} from '../input-binding/common/constraint/point-nd';
import {PointNdTextController} from '../input-binding/common/controller/point-nd-text';
import {TestUtil} from '../misc/test-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			params: {},
			value: {x: 12, y: 34, z: 56},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it('should return controller for Point3d', () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);

				const ic = bapi.controller_.controller;
				if (!(ic instanceof PointNdTextController)) {
					assert.fail('unexpected controller class');
				}
				assert.strictEqual(ic.view.textViews.length, 3);
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

		const c = (bapi.controller_.binding.value as BoundValue<unknown>)
			.constraint;
		if (!(c instanceof PointNdConstraint)) {
			assert.fail('Unexpected constraint');
		}
		const zc = c.components[2];
		if (!zc) {
			assert.fail('Unexpected constraint');
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

		const c = (bapi.controller_.binding.value as BoundValue<unknown>)
			.constraint;
		if (!(c instanceof PointNdConstraint)) {
			assert.fail('Unexpected constraint');
		}
		const zc = c.components[2];
		if (!zc) {
			assert.fail('Unexpected constraint');
		}
		const rc = findConstraint(zc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});
});
