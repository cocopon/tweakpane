import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write';
import {BindingTarget} from '../../../common/binding/target';
import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {TextController} from '../../../common/controller/text';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {writePrimitive} from '../../../common/primitive';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';
import {BindingController} from './binding';

function createController(
	doc: Document,
	config: {
		tag?: string | undefined;
	},
) {
	const obj = {foo: 0};
	const binding = new ReadWriteBinding({
		reader: numberFromUnknown,
		target: new BindingTarget(obj, 'foo'),
		writer: writePrimitive,
	});
	const value = new InputBindingValue(createValue(0), binding);
	const vc = new TextController<number>(doc, {
		parser: parseNumber,
		props: ValueMap.fromObject({
			formatter: createNumberFormatter(0),
		}),
		value: value,
		viewProps: ViewProps.create(),
	});
	return new BindingController<number>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'foo',
		}),
		tag: config.tag,
		value: value,
		valueController: vc,
	});
}

describe(BindingController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			tag: 'foo',
		});
		const state = c.exportState();

		assert.strictEqual(state.tag, 'foo');
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			tag: 'foo',
		});

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
				label: 'label',
				tag: 'bar',
				value: 0,
			}),
			true,
		);
		assert.strictEqual(c.tag, 'bar');
	});
});
