import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {Point3d} from '../model/point-3d';
import {Point3dTextController} from './point-3d-text';

describe(Point3dTextController.name, () => {
	it('should update value with user operation', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new Point3dTextController(doc, {
			axes: [
				{
					baseStep: 1,
					draggingScale: 1,
					formatter: createNumberFormatter(2),
				},
				{
					baseStep: 1,
					draggingScale: 1,
					formatter: createNumberFormatter(2),
				},
				{
					baseStep: 1,
					draggingScale: 1,
					formatter: createNumberFormatter(2),
				},
			],
			parser: parseNumber,
			value: new Value(new Point3d(12, 34, 56)),
		});

		c.view.textViews[2].inputElement.value = '3.14';
		c.view.textViews[2].inputElement.dispatchEvent(
			TestUtil.createEvent(win, 'change'),
		);
		assert.strictEqual(c.value.rawValue.z, 3.14);

		c.view.textViews[2].inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				keyCode: 38,
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue.z, 3.14 + 10);
	});
});
