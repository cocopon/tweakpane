import * as assert from 'assert';

import {View} from '../../../common/view/view';
import {BladeController} from '../controller/blade';
import {BladeApi} from './blade';

export function assertInitialState(api: BladeApi<BladeController<View>>) {
	assert.strictEqual(api.disabled, false);
	assert.strictEqual(api.hidden, false);
	assert.strictEqual(api.controller_.viewProps.get('disposed'), false);
}

export function assertDisposes(api: BladeApi<BladeController<View>>) {
	api.dispose();
	assert.strictEqual(api.controller_.viewProps.get('disposed'), true);
}

export function assertUpdates(api: BladeApi<BladeController<View>>) {
	api.disabled = true;
	assert.strictEqual(api.disabled, true);
	assert.strictEqual(
		api.controller_.view.element.classList.contains('tp-v-disabled'),
		true,
	);

	api.hidden = true;
	assert.strictEqual(api.hidden, true);
	assert.strictEqual(
		api.controller_.view.element.classList.contains('tp-v-hidden'),
		true,
	);
}
