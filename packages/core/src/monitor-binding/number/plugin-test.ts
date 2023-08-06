import * as assert from 'assert';
import {describe} from 'mocha';

import {MonitorBindingController} from '../../blade/binding/controller/monitor-binding.js';
import {BindingTarget} from '../../common/binding/target.js';
import {createTestWindow} from '../../misc/dom-test-util.js';
import {SingleLogController} from '../common/controller/single-log.js';
import {createMonitorBindingController} from '../plugin.js';
import {NumberMonitorPlugin} from './plugin.js';

describe(NumberMonitorPlugin.id, () => {
	it('should apply `format`', () => {
		const doc = createTestWindow().document;
		const obj = {
			foo: 1,
		};
		const bc = createMonitorBindingController(NumberMonitorPlugin, {
			document: doc,
			params: {
				format: () => 'formatted',
				interval: 0,
				readonly: true,
			},
			target: new BindingTarget(obj, 'foo'),
		}) as MonitorBindingController<number>;

		const c = bc.valueController as SingleLogController<number>;
		assert.strictEqual(c.view.inputElement.value, 'formatted');
	});
});
