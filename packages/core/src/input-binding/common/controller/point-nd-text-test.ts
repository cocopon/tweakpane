import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {TestUtil} from '../../../misc/test-util';
import {Point2d, Point2dAssembly} from '../../point-2d/model/point-2d';
import {PointNdTextController} from './point-nd-text';

describe(PointNdTextController.name, () => {
	it('should update value with user operation', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new PointNdTextController(doc, {
			assembly: Point2dAssembly,
			axes: [
				{
					baseStep: 1,
					constraint: undefined,
					textProps: ValueMap.fromObject({
						formatter: createNumberFormatter(0),
						draggingScale: 1,
					}),
				},
				{
					baseStep: 1,
					constraint: undefined,
					textProps: ValueMap.fromObject({
						formatter: createNumberFormatter(0),
						draggingScale: 1,
					}),
				},
			],
			parser: parseNumber,
			value: createValue(new Point2d(12, 34)),
			viewProps: ViewProps.create(),
		});

		c.view.textViews[0].inputElement.value = '3.14';
		c.view.textViews[0].inputElement.dispatchEvent(
			TestUtil.createEvent(win, 'change'),
		);
		assert.strictEqual(c.value.rawValue.x, 3.14);

		c.view.textViews[1].inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				key: 'ArrowUp',
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue.y, 34 + 10);
	});
});
