import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {MonitorBinding} from '../binding/monitor';
import {MultiLogController} from '../controller/value/multi-log';
import {SingleLogMonitorController} from '../controller/value/single-log';
import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {IntervalTicker} from '../misc/ticker/interval';

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
			value: 'foobar',
		},
		{
			expectedClass: MultiLogController,
			params: {
				count: 10,
			},
			value: 'foobar',
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const pane = createPane();
				const obj = {foo: testCase.value};
				const bapi = pane.addMonitor(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);

				const b = bapi.controller.binding;
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
