import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write';
import {BindingTarget} from '../../../common/binding/target';
import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {TextController} from '../../../common/controller/text';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {numberFromUnknown} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {InputBindingController} from '../../binding/controller/input-binding';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../view/label';
import {LabeledValueController} from './value-label';

describe(LabeledValueController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = createTestWindow().document;
		const binding = new ReadWriteBinding({
			reader: numberFromUnknown,
			target: new BindingTarget(obj, 'foo'),
			writer: (v) => v,
		});
		const value = new InputBindingValue(createValue(0), binding);
		const controller = new TextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
				formatter: createNumberFormatter(0),
			}),
			value: value,
			viewProps: ViewProps.create(),
		});
		const bc: InputBindingController<number> = new LabeledValueController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foo',
			}),
			value: value,
			valueController: controller,
		});
		assert.strictEqual(bc.value, value);
		assert.strictEqual(bc.valueController, controller);
	});
});
