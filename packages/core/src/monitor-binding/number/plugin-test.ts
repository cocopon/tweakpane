import * as assert from 'assert';
import {describe} from 'mocha';

import {MonitorBindingController} from '../../blade/monitor-binding/controller/monitor-binding';
import {BindingTarget} from '../../common/binding/target';
import {createTestWindow} from '../../misc/dom-test-util';
import {SingleLogController} from '../common/controller/single-log';
import {createMonitorBindingController} from '../plugin';
import {NumberMonitorPlugin} from './plugin';

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
			},
			target: new BindingTarget(obj, 'foo'),
		}) as MonitorBindingController<number>;

		const c = bc.valueController as SingleLogController<number>;
		assert.strictEqual(c.view.inputElement.value, 'formatted');
	});
});
