import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {findConstraint} from '../plugin/common/constraint/composite';
import {RangeConstraint} from '../plugin/common/constraint/range';
import {StepConstraint} from '../plugin/common/constraint/step';
import {PointNdConstraint} from '../plugin/input-bindings/common/constraint/point-nd';
import {PointNdTextController} from '../plugin/input-bindings/common/controller/point-nd-text';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			params: {},
			value: {x: 12, y: 34, z: 56, w: 78},
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it('should return controller for Point4d', () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addInput(obj, 'foo', testCase.params);

				const ic = bapi.controller.controller;
				if (!(ic instanceof PointNdTextController)) {
					throw new Error('unexpected controller class');
				}
				assert.strictEqual(ic.view.textViews.length, 4);
			});
		});
	});

	it('should create appropriate step constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34, z: 56, w: 78}};
		const bapi = pane.addInput(obj, 'foo', {
			w: {
				step: 1,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const wc = c.components[3];
		if (!wc) {
			throw new Error('Unexpected constraint');
		}
		const sc = findConstraint(wc, StepConstraint);
		assert.strictEqual(sc && sc.step, 1);
	});

	it('should create appropriate range constraint', () => {
		const pane = createPane();
		const obj = {foo: {x: 12, y: 34, z: 56, w: 78}};
		const bapi = pane.addInput(obj, 'foo', {
			w: {
				max: 456,
				min: -123,
			},
		});

		const c = bapi.controller.binding.value.constraint;
		if (!(c instanceof PointNdConstraint)) {
			throw new Error('Unexpected constraint');
		}
		const wc = c.components[3];
		if (!wc) {
			throw new Error('Unexpected constraint');
		}
		const rc = findConstraint(wc, RangeConstraint);
		assert.strictEqual(rc && rc.minValue, -123);
		assert.strictEqual(rc && rc.maxValue, 456);
	});
});
