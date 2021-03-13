import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {Point2d} from '../model/point-2d';
import {PointNdTextController} from './point-nd-text';

describe(PointNdTextController.name, () => {
	it('should update value with user operation', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new PointNdTextController(doc, {
			axes: [
				{
					baseStep: 1,
					formatter: createNumberFormatter(0),
					draggingScale: 1,
				},
				{
					baseStep: 1,
					formatter: createNumberFormatter(0),
					draggingScale: 1,
				},
			],
			convert: {
				fromComponents: (comps) => new Point2d(comps[0], comps[1]),
				toComponents: (p) => p.getComponents(),
			},
			parser: parseNumber,
			value: new Value(new Point2d(12, 34)),
		});

		c.view.textViews[0].inputElement.value = '3.14';
		c.view.textViews[0].inputElement.dispatchEvent(
			TestUtil.createEvent(win, 'change'),
		);
		assert.strictEqual(c.value.rawValue.x, 3.14);

		c.view.textViews[1].inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				keyCode: 38,
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue.y, 34 + 10);
	});
});
