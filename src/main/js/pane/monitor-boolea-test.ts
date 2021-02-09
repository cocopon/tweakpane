import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {MonitorBinding} from '../binding/monitor';
import {MultiLogMonitorController} from '../controller/monitor/multi-log';
import {SingleLogMonitorController} from '../controller/monitor/single-log';
import {TestUtil} from '../misc/test-util';
import {IntervalTicker} from '../misc/ticker/interval';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(PlainTweakpane.name, () => {
	[
		{
			expectedClass: SingleLogMonitorController,
			params: {},
			value: true,
		},
		{
			expectedClass: MultiLogMonitorController,
			params: {
				count: 10,
			},
			value: true,
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
