import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write';
import {BindingTarget} from '../../../common/binding/target';
import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {TextController} from '../../../common/controller/text';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {colorFromRgbNumber} from '../../../input-binding/color/converter/color-number';
import {
	colorToHexRgbString,
	createColorStringParser,
} from '../../../input-binding/color/converter/color-string';
import {createColorNumberWriter} from '../../../input-binding/color/converter/writer';
import {IntColor} from '../../../input-binding/color/model/int-color';
import {createTestWindow} from '../../../misc/dom-test-util';
import {InputBindingController} from '../../binding/controller/input-binding';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../../label/view/label';

function createController(doc: Document) {
	const obj = {
		foo: 0x112233,
	};
	const binding = new ReadWriteBinding({
		reader: colorFromRgbNumber,
		target: new BindingTarget(obj, 'foo'),
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
	return new InputBindingController<IntColor>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'foo',
		}),
		value: value,
		valueController: vc,
	});
}

describe(InputBindingController.name, () => {
	it('should import state', () => {
		const doc = createTestWindow().document;
		const bc = createController(doc);

		assert.strictEqual(
			bc.importState({
				disabled: true,
				hidden: true,
				label: 'bar',
				value: 0x445566,
			}),
			true,
		);
		assert.deepStrictEqual(
			bc.value.rawValue.getComponents(),
			[0x44, 0x55, 0x66, 1],
		);
	});
});
