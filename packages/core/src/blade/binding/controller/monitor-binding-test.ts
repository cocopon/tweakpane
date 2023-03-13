import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyBinding} from '../../../common/binding/readonly';
import {BindingTarget} from '../../../common/binding/target';
import {ManualTicker} from '../../../common/binding/ticker/manual';
import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {MonitorBindingController} from './monitor-binding';

function createController(
	doc: Document,
	config: {
		tag?: string;
		value: number;
	},
) {
	const obj = {foo: config.value};
	const binding = new ReadonlyBinding({
		reader: numberFromUnknown,
		target: new BindingTarget(obj, 'foo'),
	});
	const value = new MonitorBindingValue({
		binding: binding,
		bufferSize: 1,
		ticker: new ManualTicker(),
	});
	const vc = new SingleLogController(doc, {
		formatter: createNumberFormatter(1),
		value: value,
		viewProps: ViewProps.create(),
	});
	return new MonitorBindingController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'foo',
		}),
		tag: config.tag,
		value: value,
		valueController: vc,
	});
}

describe(MonitorBindingController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			tag: 'foo',
			value: 123,
		});
		const state = c.exportState();

		assert.strictEqual(state.readonly, true);
		assert.strictEqual(state.tag, 'foo');
		assert.strictEqual(state.value, 123);
	});
});
