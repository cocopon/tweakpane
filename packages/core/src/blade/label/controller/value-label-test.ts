import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Binding} from '../../../common/binding/binding';
import {BindingTarget} from '../../../common/binding/target';
import {BindingValue} from '../../../common/binding/value';
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
import {createBlade} from '../../common/model/blade';
import {InputBindingController} from '../../input-binding/controller/input-binding';
import {LabelPropsObject} from '../view/label';
import {LabeledValueController} from './value-label';

describe(LabeledValueController.name, () => {
	it('should get properties', () => {
		const obj = {
			foo: 123,
		};
		const doc = createTestWindow().document;
		const binding = new Binding({
			reader: numberFromUnknown,
			target: new BindingTarget(obj, 'foo'),
			writer: (v) => v,
		});
		const value = new BindingValue(createValue(0), binding);
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
