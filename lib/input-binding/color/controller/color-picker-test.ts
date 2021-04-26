import * as assert from 'assert';
import {describe, it} from 'mocha';

import {PrimitiveValue} from '../../../common/model/primitive-value';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {Color} from '../model/color';
import {ColorPickerController} from './color-picker';

describe(ColorPickerController.name, () => {
	it('should set initial color mode', () => {
		const value = new PrimitiveValue(new Color([0, 0, 0], 'hsv'));
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new ColorPickerController(doc, {
			supportsAlpha: false,
			value: value,
			viewProps: createViewProps(),
		});

		assert.strictEqual(c.textController.view.modeSelectElement.value, 'hsv');
	});

	it('should change hue of black in HSL', () => {
		const value = new PrimitiveValue(new Color([0, 0, 0], 'rgb'));
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new ColorPickerController(doc, {
			supportsAlpha: false,
			value: value,
			viewProps: createViewProps(),
		});

		// Change color mode to HSL
		const modeSelectElem = c.textController.view.modeSelectElement;
		modeSelectElem.value = 'hsl';
		modeSelectElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
		assert.strictEqual(c.textController.colorMode.rawValue, 'hsl');

		// Change hue value
		const hInputElem = c.textController.view.textViews[0].inputElement;
		hInputElem.value = '10';
		hInputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue.getComponents('hsl')[0], 10);
		assert.strictEqual(hInputElem.value, '10');
	});
});
