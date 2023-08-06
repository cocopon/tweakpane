import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadonlyBinding} from '../../../common/binding/readonly.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {ManualTicker} from '../../../common/binding/ticker/manual.js';
import {MonitorBindingValue} from '../../../common/binding/value/monitor-binding.js';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../../common/converter/number.js';
import {LabelPropsObject} from '../../../common/label/view/label.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {SingleLogController} from '../../../monitor-binding/common/controller/single-log.js';
import {createBlade} from '../../common/model/blade.js';
import {MonitorBindingController} from './monitor-binding.js';

function createController(
	doc: Document,
	config: {
		tag?: string;
		key: string;
		value: number;
	},
) {
	const obj = {[config.key]: config.value};
	const binding = new ReadonlyBinding({
		reader: numberFromUnknown,
		target: new BindingTarget(obj, config.key),
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
			key: 'foo',
			tag: 'bar',
			value: 123,
		});

		assert.deepStrictEqual(c.exportState(), {
			binding: {
				key: 'foo',
				readonly: true,
				value: 123,
			},
			disabled: false,
			hidden: false,
			label: 'foo',
			tag: 'bar',
		});
	});
});
