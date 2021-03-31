import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {MonitorBinding} from '../common/binding/monitor';
import {IntervalTicker} from '../common/binding/ticker/interval';
import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {MultiLogController} from '../monitor-binding/common/controller/multi-log';
import {SingleLogMonitorController} from '../monitor-binding/common/controller/single-log';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
	[
		{
			expectedClass: SingleLogMonitorController,
			params: {},
			value: true,
		},
		{
			expectedClass: MultiLogController,
			params: {
				bufferSize: 10,
			},
			value: true,
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addMonitor(obj, 'foo', testCase.params);
				assert.strictEqual(
					bapi.controller_.controller instanceof testCase.expectedClass,
					true,
				);

				const b = bapi.controller_.binding;
				if (b instanceof MonitorBinding) {
					const t = b.ticker;
					if (t instanceof IntervalTicker) {
						t.disposable.dispose();
					}
				}
			});
		});
	});
});
