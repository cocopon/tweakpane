import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {InputBindingValue} from '../../../common/binding/value/input-binding.js';
import {TextController} from '../../../common/controller/text.js';
import {LabelPropsObject} from '../../../common/label/view/label.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {colorFromRgbNumber} from '../../../input-binding/color/converter/color-number.js';
import {
	colorToHexRgbString,
	createColorStringParser,
} from '../../../input-binding/color/converter/color-string.js';
import {createColorNumberWriter} from '../../../input-binding/color/converter/writer.js';
import {IntColor} from '../../../input-binding/color/model/int-color.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createBlade} from '../../common/model/blade.js';
import {BindingController} from './binding.js';
import {InputBindingController} from './input-binding.js';

function createController(
	doc: Document,
	config: {
		key: string;
		tag?: string;
		value: number;
	},
) {
	const obj = {[config.key]: config.value};
	const binding = new ReadWriteBinding({
		reader: colorFromRgbNumber,
		target: new BindingTarget(obj, config.key),
		writer: createColorNumberWriter(false),
	});
	const value = new InputBindingValue(
		createValue(new IntColor([0, 0, 0], 'rgb')),
		binding,
	);
	const vc = new TextController<IntColor>(doc, {
		parser: createColorStringParser('int'),
		props: ValueMap.fromObject({
			formatter: (v) => colorToHexRgbString(v, '0x'),
		}),
		value: value,
		viewProps: ViewProps.create(),
	});
	return {
		value: value,
		valueController: vc,
		controller: new InputBindingController<IntColor>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foo',
			}),
			tag: config.tag,
			value: value,
			valueController: vc,
		}),
	};
}

describe(BindingController.name, () => {
	it('should get properties', () => {
		const doc = createTestWindow().document;
		const {
			value,
			valueController: vc,
			controller: bc,
		} = createController(doc, {
			key: 'foo',
			value: 0x112233,
		});

		assert.strictEqual(bc.value, value);
		assert.strictEqual(bc.valueController, vc);
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const {controller: c} = createController(doc, {
			key: 'foo',
			tag: 'bar',
			value: 0x112233,
		});

		assert.deepStrictEqual(c.exportState(), {
			binding: {
				key: 'foo',
				value: 0x112233,
			},
			disabled: false,
			hidden: false,
			label: 'foo',
			tag: 'bar',
		});
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const {controller: c} = createController(doc, {
			key: 'foo',
			tag: 'bar',
			value: 0x112233,
		});

		assert.strictEqual(
			c.importState({
				binding: {
					key: 'foo',
					value: 0,
				},
				disabled: true,
				hidden: true,
				label: 'label',
				tag: 'baz',
			}),
			true,
		);
		assert.strictEqual(c.tag, 'baz');
	});
});
