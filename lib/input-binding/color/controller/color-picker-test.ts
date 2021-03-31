import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BoundValue} from '../../../common/model/bound-value';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {Color} from '../model/color';
import {PickedColor} from '../model/picked-color';
import {ColorPickerController} from './color-picker';

describe(ColorPickerController.name, () => {
	it('should set initial color mode', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const pc = new PickedColor(new BoundValue(new Color([0, 0, 0], 'hsv')));
		const c = new ColorPickerController(doc, {
			pickedColor: pc,
			supportsAlpha: false,
			viewProps: createViewProps(),
		});

		assert.strictEqual(c.textController.view.modeSelectElement.value, 'hsv');
	});

	it('should change hue of black in HSL', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const pc = new PickedColor(new BoundValue(new Color([0, 0, 0], 'rgb')));
		const c = new ColorPickerController(doc, {
			pickedColor: pc,
			supportsAlpha: false,
			viewProps: createViewProps(),
		});

		// Change color mode to HSL
		const modeSelectElem = c.textController.view.modeSelectElement;
		modeSelectElem.value = 'hsl';
		modeSelectElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
		assert.strictEqual(pc.mode, 'hsl');

		// Change hue value
		const hInputElem = c.textController.view.textViews[0].inputElement;
		hInputElem.value = '10';
		hInputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(pc.value.rawValue.getComponents('hsl')[0], 10);
		assert.strictEqual(hInputElem.value, '10');
	});
});
