import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {TestUtil} from '../../../misc/test-util';
import {Color} from '../model/color';
import {ColorPickerController} from './color-picker';

describe(ColorPickerController.name, () => {
	it('should set initial color mode', () => {
		const value = createValue(new Color([0, 0, 0], 'hsv'));
		const win = createTestWindow();
		const doc = win.document;
		const c = new ColorPickerController(doc, {
			colorType: value.rawValue.type,
			supportsAlpha: false,
			value: value,
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(c.textController.view.modeSelectElement.value, 'hsv');
	});

	it('should change hue of black in HSL', () => {
		const value = createValue(new Color([0, 0, 0], 'rgb'));
		const win = createTestWindow();
		const doc = win.document;
		const c = new ColorPickerController(doc, {
			colorType: value.rawValue.type,
			supportsAlpha: false,
			value: value,
			viewProps: ViewProps.create(),
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
