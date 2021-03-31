import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import Tweakpane from '../index';
import {TestUtil} from '../misc/test-util';
import {MonitorBinding} from '../plugin/common/binding/monitor';
import {IntervalTicker} from '../plugin/common/binding/ticker/interval';
import {MultiLogController} from '../plugin/monitor-bindings/common/controller/multi-log';
import {SingleLogMonitorController} from '../plugin/monitor-bindings/common/controller/single-log';
import {GraphLogController} from '../plugin/monitor-bindings/number/controller/graph-log';

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
			value: 123,
		},
		{
			expectedClass: MultiLogController,
			params: {
				bufferSize: 10,
			},
			value: 123,
		},
		{
			expectedClass: GraphLogController,
			params: {
				view: 'graph',
			},
			value: 123,
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

	it('should have right initial buffer', () => {
		const pane = createPane();
		const obj = {foo: 123};
		const bapi = pane.addMonitor(obj, 'foo', {
			bufferSize: 5,
			interval: 0,
		});

		const v = bapi.controller_.binding.value;
		assert.deepStrictEqual(v.rawValue, [
			123,
			undefined,
			undefined,
			undefined,
			undefined,
		]);
	});
});
